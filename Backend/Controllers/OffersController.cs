using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Data;
using HackathonProject.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace HackathonProject.Controllers
{
    [Authorize(Roles = "Farmer,Buyer")]
[ApiController]
    [Route("api/[controller]")]
    public class OffersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OffersController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OfferResponseDto>>> GetOffers()
        {
            var offers = await _context.Offers.Include(o => o.Buyer).ToListAsync();

            return Ok(offers.Select(o => new OfferResponseDto
            {
                OfferId = o.OfferId,
                CropListingId = o.CropListingId,
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
            }).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OfferResponseDto>> GetOffer(int id)
        {
            var o = await _context.Offers.Include(x => x.Buyer).FirstOrDefaultAsync(x => x.OfferId == id);
            if (o == null) return NotFound();

            return Ok(new OfferResponseDto
            {
                OfferId = o.OfferId,
                CropListingId = o.CropListingId,
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
            });
        }

        [HttpPost]
        public async Task<ActionResult> PostOffer(OfferCreateDto dto)
        {
            var offer = new Offer
            {
                CropListingId = dto.CropListingId,
                BuyerId = dto.BuyerId,
                OfferedByUserId = dto.OfferedByUserId,
                Quantity = dto.Quantity,
                OfferedPrice = dto.OfferedPrice,
                DeliveryDate = dto.DeliveryDate,
                DeliveryConditions = dto.DeliveryConditions,
                ParentOfferId = dto.ParentOfferId,
                Status = Models.Enums.OfferStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Offers.Add(offer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOffer), new { id = offer.OfferId }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOffer(int id, OfferUpdateDto dto)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null) return NotFound();

            offer.Quantity = dto.Quantity;
            offer.OfferedPrice = dto.OfferedPrice;
            offer.DeliveryDate = dto.DeliveryDate;
            offer.DeliveryConditions = dto.DeliveryConditions;
            offer.Status = dto.Status;
            offer.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffer(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null) return NotFound();

            _context.Offers.Remove(offer);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}


