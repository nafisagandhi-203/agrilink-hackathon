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
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITransactionService _transactionService;

        public TransactionsController(ApplicationDbContext context, ITransactionService transactionService)
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

        private static TransactionResponseDto ToDto(Transaction t) => new TransactionResponseDto
        {
            TransactionId = t.TransactionId,
            CropListingId = t.CropListingId,
            CropName = t.Crop?.CropName ?? string.Empty,
            FarmerId = t.FarmerId,
            FarmerName = t.Farmer?.User?.FullName ?? t.Farmer?.FarmName ?? string.Empty,
            BuyerId = t.BuyerId,
            BuyerName = t.Buyer?.BusinessName ?? string.Empty,
            OfferId = t.OfferId,
            CropId = t.CropId,
            Quantity = t.Quantity,
            AgreedPrice = t.AgreedPrice,
            TotalAmount = t.TotalAmount,
            DeliveryDate = t.DeliveryDate,
            TransactionStatus = t.TransactionStatus.ToString(),
            CreatedAt = t.CreatedAt,
            CompletedAt = t.CompletedAt
        };

        private IQueryable<Transaction> TransactionQuery() => _context.Transactions
            .Include(t => t.Farmer).ThenInclude(f => f.User)
            .Include(t => t.Buyer)
            .Include(t => t.Crop);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetTransactions()
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var farmerId = await GetFarmerIdAsync(userId.Value);
            var buyerId = await GetBuyerIdAsync(userId.Value);

            var query = TransactionQuery();
            if (User.IsInRole("Admin"))
            {
                // Admin has full visibility over all ecosystem transactions
            }
            else if (farmerId.HasValue)
            {
                query = query.Where(t => t.FarmerId == farmerId.Value);
            }
            else if (buyerId.HasValue)
            {
                query = query.Where(t => t.BuyerId == buyerId.Value);
            }
            else
            {
                return Forbid();
            }

            var transactions = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
            return Ok(transactions.Select(ToDto));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionResponseDto>> GetTransaction(int id)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var transaction = await TransactionQuery().FirstOrDefaultAsync(t => t.TransactionId == id);
            if (transaction == null) return NotFound();

            var farmerId = await GetFarmerIdAsync(userId.Value);
            var buyerId = await GetBuyerIdAsync(userId.Value);
            var isParticipant = (farmerId.HasValue && transaction.FarmerId == farmerId.Value)
                || (buyerId.HasValue && transaction.BuyerId == buyerId.Value)
                || User.IsInRole("Admin");

            if (!isParticipant) return Forbid();

            return Ok(ToDto(transaction));
        }

        [HttpPost]
        [Authorize(Roles = "Farmer")]
        public async Task<ActionResult> PostTransaction(TransactionCreateFromOfferDto dto)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var farmerId = await GetFarmerIdAsync(userId.Value);
            if (farmerId == null) return Forbid();

            var offer = await _context.Offers
                .Include(o => o.CropListing)
                .FirstOrDefaultAsync(o => o.OfferId == dto.OfferId);
            if (offer == null) return NotFound("Offer not found.");
            if (offer.CropListing == null || offer.CropListing.FarmerId != farmerId.Value)
                return Forbid();
            if (offer.Status != OfferStatus.Accepted)
                return BadRequest("Only an accepted offer can create a transaction.");

            var (transaction, error) = await _transactionService.CreateFromAcceptedOfferAsync(dto.OfferId);
            if (error != null) return BadRequest(error);

            await _transactionService.CreateNotificationAsync(
                offer.OfferedByUserId, NotificationType.Transaction,
                "Deal confirmed",
                $"A transaction (TXN-{transaction!.TransactionId}) was created for offer #{dto.OfferId}.");

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.TransactionId }, ToDto(transaction));
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateTransactionStatus(int id, TransactionStatusUpdateDto dto)
        {
            var userId = CurrentUserId;
            if (userId == null) return Unauthorized();

            var transaction = await TransactionQuery().FirstOrDefaultAsync(t => t.TransactionId == id);
            if (transaction == null) return NotFound();

            var farmerId = await GetFarmerIdAsync(userId.Value);
            var buyerId = await GetBuyerIdAsync(userId.Value);
            var isParticipant = (farmerId.HasValue && transaction.FarmerId == farmerId.Value)
                || (buyerId.HasValue && transaction.BuyerId == buyerId.Value);
            if (!isParticipant) return Forbid();

            if (!IsValidTransition(transaction.TransactionStatus, dto.Status))
                return BadRequest($"Cannot transition from {transaction.TransactionStatus} to {dto.Status}.");

            transaction.TransactionStatus = dto.Status;
            transaction.UpdatedAt = DateTime.UtcNow;
            if (dto.Status == TransactionStatus.Completed)
                transaction.CompletedAt = DateTime.UtcNow;

            if (dto.Status == TransactionStatus.Cancelled)
            {
                var listing = await _context.CropListings.FirstOrDefaultAsync(cl => cl.CropListingId == transaction.CropListingId);
                if (listing != null)
                {
                    listing.AvailableQuantity += transaction.Quantity;
                    listing.UpdatedAt = DateTime.UtcNow;
                    if (listing.Status == CropListingStatus.Sold && listing.AvailableQuantity > 0)
                        listing.Status = CropListingStatus.Available;
                }
            }

            await _context.SaveChangesAsync();

            var otherUser = farmerId.HasValue && transaction.FarmerId == farmerId.Value
                ? transaction.Buyer?.UserId
                : transaction.Farmer?.UserId;
            if (otherUser.HasValue)
            {
                await _transactionService.CreateNotificationAsync(
                    otherUser.Value, NotificationType.Transaction,
                    "Transaction updated",
                    $"Transaction TXN-{transaction.TransactionId} is now {dto.Status}.");
            }

            return Ok(new { TransactionId = transaction.TransactionId, Status = dto.Status.ToString() });
        }

        private static bool IsValidTransition(TransactionStatus current, TransactionStatus next)
        {
            return (current, next) switch
            {
                (TransactionStatus.Confirmed, TransactionStatus.Preparing) => true,
                (TransactionStatus.Confirmed, TransactionStatus.Cancelled) => true,
                (TransactionStatus.Preparing, TransactionStatus.InTransit) => true,
                (TransactionStatus.Preparing, TransactionStatus.Cancelled) => true,
                (TransactionStatus.InTransit, TransactionStatus.Delivered) => true,
                (TransactionStatus.InTransit, TransactionStatus.Cancelled) => true,
                (TransactionStatus.Delivered, TransactionStatus.Completed) => true,
                _ => false
            };
        }
    }
}