using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Enums;
using Data;
using HackathonProject.DTOs;
using Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace HackathonProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Farmer,Buyer,Admin")]
    public class OffersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITransactionService _transactionService;

        public OffersController(ApplicationDbContext context, ITransactionService transactionService)
        {
            _context = context;
            _transactionService = transactionService;
        }

        private int? CurrentUserId =>
            int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : (int?)null;

        private async Task<int?> GetFarmerIdAsync(int userId) =>
            (await _context.Farmers.FirstOrDefaultAsync(f => f.UserId == userId))?.FarmerId;

        private async Task<int?> GetBuyerIdAsync(int userId) =>
            (await _context.Buyers.FirstOrDefaultAsync(b => b.UserId == userId))?.BuyerId;

        private static OfferResponseDto ToDto(Offer o) => new OfferResponseDto
        {
            OfferId = o.OfferId,
            CropListingId = o.CropListingId,
            CropName = o.CropListing?.Crop?.CropName ?? string.Empty,
            FarmerName = o.CropListing?.Farmer?.User?.FullName ?? o.CropListing?.Farmer?.FarmName ?? string.Empty,
            BuyerId = o.BuyerId,
            BuyerName = o.Buyer?.BusinessName ?? string.Empty,
            OfferedByUserId = o.OfferedByUserId,
            Quantity = o.Quantity,
            OfferedPrice = o.OfferedPrice,
            DeliveryDate = o.DeliveryDate,
            DeliveryConditions = o.DeliveryConditions,
            ParentOfferId = o.ParentOfferId,
            Status = o.Status.ToString(),
            CreatedAt = o.CreatedAt
        };

        private IQueryable<Offer> OfferQuery() => _context.Offers
            .Include(o => o.Buyer)
            .Include(o => o.CropListing).ThenInclude(cl => cl.Crop)
            .Include(o => o.CropListing).ThenInclude(cl => cl.Farmer).ThenInclude(f => f.User);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OfferResponseDto>>> GetOffers()
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var farmerId = await GetFarmerIdAsync(userId.Value);
            var buyerId = await GetBuyerIdAsync(userId.Value);

            var query = OfferQuery();
            if (User.IsInRole("Admin"))
            {
                // Admin can see all marketplace offers
            }
            else if (farmerId.HasValue)
            {
                query = query.Where(o => o.CropListing != null && o.CropListing.FarmerId == farmerId.Value);
            }
            else if (buyerId.HasValue)
            {
                query = query.Where(o => o.BuyerId == buyerId.Value);
            }
            else
            {
                return Forbid();
            }

            var offers = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
            return Ok(offers.Select(ToDto));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OfferResponseDto>> GetOffer(int id)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var offer = await OfferQuery().FirstOrDefaultAsync(o => o.OfferId == id);
            if (offer == null) return NotFound();

            var farmerId = await GetFarmerIdAsync(userId.Value);
            var buyerId = await GetBuyerIdAsync(userId.Value);
            var isFarmerPart = farmerId.HasValue && offer.CropListing != null && offer.CropListing.FarmerId == farmerId.Value;
            var isBuyerPart = buyerId.HasValue && offer.BuyerId == buyerId.Value;

            if (!isFarmerPart && !isBuyerPart && !User.IsInRole("Admin")) return Forbid();

            return Ok(ToDto(offer));
        }

        [HttpPost]
        [Authorize(Roles = "Buyer")]
        public async Task<ActionResult<OfferResponseDto>> PostOffer(OfferCreateDto dto)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var buyerId = await GetBuyerIdAsync(userId.Value);
            if (buyerId == null) return Forbid();

            var listing = await _context.CropListings
                .Include(cl => cl.Farmer)
                .FirstOrDefaultAsync(cl => cl.CropListingId == dto.CropListingId);
            if (listing == null) return NotFound("Listing not found.");
            if (listing.Status != CropListingStatus.Available)
                return BadRequest("This listing is no longer available.");
            if (dto.Quantity > listing.AvailableQuantity)
                return BadRequest($"Offer quantity exceeds available quantity ({listing.AvailableQuantity} {listing.Unit}).");

            var activeOfferExists = await _context.Offers.AnyAsync(o =>
                o.CropListingId == dto.CropListingId
                && o.BuyerId == buyerId.Value
                && (o.Status == OfferStatus.Pending || o.Status == OfferStatus.Countered));
            if (activeOfferExists)
                return Conflict("You already have an active offer on this listing. Counter or wait for a response.");

            var offer = new Offer
            {
                CropListingId = dto.CropListingId,
                BuyerId = buyerId.Value,
                OfferedByUserId = userId.Value,
                Quantity = dto.Quantity,
                OfferedPrice = dto.OfferedPrice,
                DeliveryDate = dto.DeliveryDate,
                DeliveryConditions = dto.DeliveryConditions,
                Status = OfferStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Offers.Add(offer);
            await _context.SaveChangesAsync();

            await _transactionService.CreateNotificationAsync(
                listing.Farmer.UserId, NotificationType.Offer,
                "New offer received",
                $"A buyer offered ₹{dto.OfferedPrice} for {dto.Quantity} {listing.Unit} of your listing #{dto.CropListingId}.");

            return CreatedAtAction(nameof(GetOffer), new { id = offer.OfferId }, ToDto(await OfferQuery().FirstAsync(o => o.OfferId == offer.OfferId)));
        }

        [HttpPost("{id}/counter")]
        public async Task<ActionResult<OfferResponseDto>> CounterOffer(int id, OfferCreateDto dto)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var parent = await OfferQuery().FirstOrDefaultAsync(o => o.OfferId == id);
            if (parent == null) return NotFound();
            if (parent.Status != OfferStatus.Pending && parent.Status != OfferStatus.Countered)
                return BadRequest("This offer can no longer be countered.");

            var farmerId = await GetFarmerIdAsync(userId.Value);
            var buyerId = await GetBuyerIdAsync(userId.Value);
            var listing = parent.CropListing;
            if (listing == null) return NotFound("Listing not found.");
            if (listing.Status != CropListingStatus.Available)
                return BadRequest("This listing is no longer available.");

            var isFarmerOwner = farmerId.HasValue && listing.FarmerId == farmerId.Value;
            var isBuyerPart = buyerId.HasValue && parent.BuyerId == buyerId.Value;
            if (!isFarmerOwner && !isBuyerPart) return Forbid();

            if (dto.Quantity > listing.AvailableQuantity)
                return BadRequest($"Offer quantity exceeds available quantity ({listing.AvailableQuantity} {listing.Unit}).");
            if (dto.OfferedPrice <= 0)
                return BadRequest("Offered price must be greater than zero.");

            var child = new Offer
            {
                CropListingId = parent.CropListingId,
                BuyerId = parent.BuyerId,
                OfferedByUserId = userId.Value,
                Quantity = dto.Quantity,
                OfferedPrice = dto.OfferedPrice,
                DeliveryDate = dto.DeliveryDate,
                DeliveryConditions = dto.DeliveryConditions,
                ParentOfferId = parent.OfferId,
                Status = OfferStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            parent.Status = OfferStatus.Countered;
            parent.UpdatedAt = DateTime.UtcNow;

            _context.Offers.Add(child);
            await _context.SaveChangesAsync();

            var otherUser = isFarmerOwner ? parent.OfferedByUserId : listing.Farmer.UserId;
            await _transactionService.CreateNotificationAsync(
                otherUser, NotificationType.Offer,
                "Counter-offer received",
                $"A counter-offer of ₹{dto.OfferedPrice} for {dto.Quantity} {listing.Unit} was made on offer #{id}.");

            return CreatedAtAction(nameof(GetOffer), new { id = child.OfferId }, ToDto(await OfferQuery().FirstAsync(o => o.OfferId == child.OfferId)));
        }

        [HttpPost("{id}/accept")]
        [Authorize(Roles = "Farmer")]
        public async Task<ActionResult> AcceptOffer(int id)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var farmerId = await GetFarmerIdAsync(userId.Value);
            if (farmerId == null) return Forbid();

            var offer = await OfferQuery().FirstOrDefaultAsync(o => o.OfferId == id);
            if (offer == null) return NotFound();
            if (offer.CropListing == null || offer.CropListing.FarmerId != farmerId.Value)
                return Forbid();
            if (offer.Status != OfferStatus.Pending)
                return BadRequest("Only a pending offer can be accepted.");

            await using var tx = await _context.Database.BeginTransactionAsync();

            offer.Status = OfferStatus.Accepted;
            offer.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var (transaction, error) = await _transactionService.CreateFromAcceptedOfferAsync(id);
            if (error != null)
            {
                await tx.RollbackAsync();
                return BadRequest(error);
            }

            await _transactionService.CreateNotificationAsync(
                offer.OfferedByUserId, NotificationType.Transaction,
                "Offer accepted",
                $"Your offer #{id} on listing #{offer.CropListingId} was accepted. A transaction (TXN-{transaction!.TransactionId}) was created.");
            await _transactionService.CreateNotificationAsync(
                offer.CropListing.Farmer.UserId, NotificationType.Transaction,
                "Deal confirmed",
                $"A transaction (TXN-{transaction.TransactionId}) was created for offer #{id}.");

            await tx.CommitAsync();

            return Ok(new { TransactionId = transaction!.TransactionId });
        }

        [HttpPost("{id}/reject")]
        public async Task<ActionResult> RejectOffer(int id)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var offer = await OfferQuery().FirstOrDefaultAsync(o => o.OfferId == id);
            if (offer == null) return NotFound();
            if (offer.Status != OfferStatus.Pending && offer.Status != OfferStatus.Countered)
                return BadRequest("Only a pending or countered offer can be rejected.");

            var farmerId = await GetFarmerIdAsync(userId.Value);
            var buyerId = await GetBuyerIdAsync(userId.Value);
            var isFarmerOwner = farmerId.HasValue && offer.CropListing != null && offer.CropListing.FarmerId == farmerId.Value;
            var isOfferer = buyerId.HasValue && offer.BuyerId == buyerId.Value;

            if (!isFarmerOwner && !isOfferer) return Forbid();

            offer.Status = OfferStatus.Rejected;
            offer.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var otherUser = isFarmerOwner ? offer.OfferedByUserId : offer.CropListing!.Farmer.UserId;
            await _transactionService.CreateNotificationAsync(
                otherUser, NotificationType.Offer, "Offer rejected", $"Offer #{id} was rejected.");

            return Ok(new { OfferId = id, Status = "Rejected" });
        }

        [HttpPost("{id}/cancel")]
        [Authorize(Roles = "Buyer")]
        public async Task<ActionResult> CancelOffer(int id)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var offer = await OfferQuery().FirstOrDefaultAsync(o => o.OfferId == id);
            if (offer == null) return NotFound();

            var buyerId = await GetBuyerIdAsync(userId.Value);
            if (buyerId == null || offer.BuyerId != buyerId.Value) return Forbid();

            if (offer.Status != OfferStatus.Pending && offer.Status != OfferStatus.Countered)
                return BadRequest("Only a pending or countered offer can be cancelled.");

            offer.Status = OfferStatus.Cancelled;
            offer.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await _transactionService.CreateNotificationAsync(
                offer.CropListing!.Farmer.UserId, NotificationType.Offer,
                "Offer withdrawn", $"A buyer withdrew offer #{id}.");

            return Ok(new { OfferId = id, Status = "Cancelled" });
        }
    }
}