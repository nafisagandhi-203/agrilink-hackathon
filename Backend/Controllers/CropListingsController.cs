using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Data;
using HackathonProject.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace HackathonProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CropListingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CropListingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CropListingResponseDto>>> GetCropListings()
        {
            var listings = await _context.CropListings
                .Include(c => c.Crop)
                .Include(c => c.Farmer)
                    .ThenInclude(f => f.User)
                .ToListAsync();

            var response = listings.Select(c => new CropListingResponseDto
            {
                CropListingId = c.CropListingId,
                FarmerId = c.FarmerId,
                FarmerName = c.Farmer?.User?.FullName ?? c.Farmer?.FarmName ?? string.Empty,
                CropId = c.CropId,
                CropName = c.Crop?.CropName ?? string.Empty,
                Quantity = c.Quantity,
                AvailableQuantity = c.AvailableQuantity,
                Unit = c.Unit,
                QualityGrade = c.QualityGrade,
                Location = c.Location,
                District = c.District,
                State = c.State,
                Pincode = c.Pincode,
                ExpectedSellingDate = c.ExpectedSellingDate,
                AskingPrice = c.AskingPrice,
                Status = c.Status.ToString(),
                CreatedAt = c.CreatedAt
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<CropListingResponseDto>> GetCropListing(int id)
        {
            var listing = await _context.CropListings
                .Include(c => c.Crop)
                .Include(c => c.Farmer)
                    .ThenInclude(f => f.User)
                .FirstOrDefaultAsync(c => c.CropListingId == id);

            if (listing == null) return NotFound();

            return Ok(new CropListingResponseDto
            {
                CropListingId = listing.CropListingId,
                FarmerId = listing.FarmerId,
                FarmerName = listing.Farmer?.User?.FullName ?? listing.Farmer?.FarmName ?? string.Empty,
                CropId = listing.CropId,
                CropName = listing.Crop?.CropName ?? string.Empty,
                Quantity = listing.Quantity,
                AvailableQuantity = listing.AvailableQuantity,
                Unit = listing.Unit,
                QualityGrade = listing.QualityGrade,
                Location = listing.Location,
                District = listing.District,
                State = listing.State,
                Pincode = listing.Pincode,
                ExpectedSellingDate = listing.ExpectedSellingDate,
                AskingPrice = listing.AskingPrice,
                Status = listing.Status.ToString(),
                CreatedAt = listing.CreatedAt
            });
        }

        [HttpPost]
        [Authorize(Roles = "Farmer")]
        public async Task<ActionResult<CropListingResponseDto>> PostCropListing(CropListingCreateDto dto)
        {
            var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();

            var isOwner = await _context.Farmers.AnyAsync(f => f.FarmerId == dto.FarmerId && f.UserId == currentUserId);
            if (!isOwner) return Forbid();

            var cropListing = new CropListing
            {
                FarmerId = dto.FarmerId,
                CropId = dto.CropId,
                Quantity = dto.Quantity,
                AvailableQuantity = dto.Quantity, // Initially equal
                Unit = dto.Unit,
                QualityGrade = dto.QualityGrade,
                Location = dto.Location,
                District = dto.District,
                State = dto.State,
                Pincode = dto.Pincode,
                ExpectedSellingDate = dto.ExpectedSellingDate,
                AskingPrice = dto.AskingPrice,
                Status = Models.Enums.CropListingStatus.Available,
                CreatedAt = DateTime.UtcNow
            };

            _context.CropListings.Add(cropListing);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCropListing), new { id = cropListing.CropListingId }, null);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Farmer")]
        public async Task<IActionResult> PutCropListing(int id, CropListingUpdateDto dto)
        {
            var cropListing = await _context.CropListings.FindAsync(id);
            if (cropListing == null) return NotFound();

            var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();

            var isOwner = await _context.Farmers.AnyAsync(f => f.FarmerId == cropListing.FarmerId && f.UserId == currentUserId);
            if (!isOwner) return Forbid();

            cropListing.Quantity = dto.Quantity;
            cropListing.Unit = dto.Unit;
            cropListing.QualityGrade = dto.QualityGrade;
            cropListing.Location = dto.Location;
            cropListing.District = dto.District;
            cropListing.State = dto.State;
            cropListing.Pincode = dto.Pincode;
            cropListing.ExpectedSellingDate = dto.ExpectedSellingDate;
            cropListing.AskingPrice = dto.AskingPrice;
            cropListing.Status = dto.Status;
            cropListing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Farmer")]
        public async Task<IActionResult> DeleteCropListing(int id)
        {
            var cropListing = await _context.CropListings.FindAsync(id);
            if (cropListing == null) return NotFound();

            var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();

            var isOwner = await _context.Farmers.AnyAsync(f => f.FarmerId == cropListing.FarmerId && f.UserId == currentUserId);
            if (!isOwner) return Forbid();

            _context.CropListings.Remove(cropListing);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
