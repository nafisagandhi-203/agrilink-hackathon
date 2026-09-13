using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Enums;
using Data;
using HackathonProject.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Services;

namespace HackathonProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CropListingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IImageStorageService _imageStorageService;

        public CropListingsController(ApplicationDbContext context, IImageStorageService imageStorageService)
        {
            _context = context;
            _imageStorageService = imageStorageService;
        }

        [HttpGet]
        [AllowAnonymous]
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
                ImageUrl = c.ImageUrl,
                Status = c.Status.ToString(),
                CreatedAt = c.CreatedAt
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
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
                ImageUrl = listing.ImageUrl,
                Status = listing.Status.ToString(),
                CreatedAt = listing.CreatedAt
            });
        }

        [HttpPost]
        [Authorize(Roles = "Farmer,Admin")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<CropListingResponseDto>> PostCropListing([FromForm] CropListingCreateFormDto dto)
        {
            var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();

            if (dto.FarmerId <= 0)
            {
                var farmer = await _context.Farmers.FirstOrDefaultAsync(f => f.UserId == currentUserId);
                if (farmer != null) dto.FarmerId = farmer.FarmerId;
            }

            var isAdmin = User.IsInRole("Admin");
            var isOwner = isAdmin || await _context.Farmers.AnyAsync(f => f.FarmerId == dto.FarmerId && f.UserId == currentUserId);
            if (!isOwner) return Forbid();

            string? finalImageUrl = dto.ImageUrl;

            // Process image file if provided in multipart form
            if (dto.Image != null && dto.Image.Length > 0)
            {
                var (success, imageUrl, error) = await _imageStorageService.SaveCropImageAsync(dto.Image);
                if (!success)
                {
                    return BadRequest(new { message = error });
                }
                finalImageUrl = imageUrl;
            }

            var cropListing = new CropListing
            {
                FarmerId = dto.FarmerId,
                CropId = dto.CropId,
                Quantity = dto.Quantity,
                AvailableQuantity = dto.Quantity,
                Unit = dto.Unit,
                QualityGrade = dto.QualityGrade,
                Location = dto.Location,
                District = dto.District,
                State = dto.State,
                Pincode = dto.Pincode,
                ExpectedSellingDate = dto.ExpectedSellingDate,
                AskingPrice = dto.AskingPrice,
                ImageUrl = finalImageUrl,
                Status = Models.Enums.CropListingStatus.Available,
                CreatedAt = DateTime.UtcNow
            };

            _context.CropListings.Add(cropListing);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCropListing), new { id = cropListing.CropListingId }, new CropListingResponseDto
            {
                CropListingId = cropListing.CropListingId,
                FarmerId = cropListing.FarmerId,
                CropId = cropListing.CropId,
                Quantity = cropListing.Quantity,
                AvailableQuantity = cropListing.AvailableQuantity,
                Unit = cropListing.Unit,
                QualityGrade = cropListing.QualityGrade,
                Location = cropListing.Location,
                District = cropListing.District,
                State = cropListing.State,
                Pincode = cropListing.Pincode,
                ExpectedSellingDate = cropListing.ExpectedSellingDate,
                AskingPrice = cropListing.AskingPrice,
                ImageUrl = cropListing.ImageUrl,
                Status = cropListing.Status.ToString(),
                CreatedAt = cropListing.CreatedAt
            });
        }

        [HttpPost("json")]
        [Authorize(Roles = "Farmer,Admin")]
        public async Task<ActionResult<CropListingResponseDto>> PostCropListingJson([FromBody] CropListingCreateDto dto)
        {
            var formDto = new CropListingCreateFormDto
            {
                FarmerId = dto.FarmerId,
                CropId = dto.CropId,
                Quantity = dto.Quantity,
                Unit = dto.Unit,
                QualityGrade = dto.QualityGrade,
                Location = dto.Location,
                District = dto.District,
                State = dto.State,
                Pincode = dto.Pincode,
                ExpectedSellingDate = dto.ExpectedSellingDate,
                AskingPrice = dto.AskingPrice,
                ImageUrl = dto.ImageUrl
            };
            return await PostCropListing(formDto);
        }

        [HttpPost("{id}/image")]
        [Authorize(Roles = "Farmer,Admin")]
        public async Task<ActionResult<CropListingImageUploadResponseDto>> UploadCropListingImage(int id, IFormFile image)
        {
            var cropListing = await _context.CropListings.FindAsync(id);
            if (cropListing == null) return NotFound(new { message = "Crop listing not found" });

            var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();

            var isAdmin = User.IsInRole("Admin");
            var isOwner = isAdmin || await _context.Farmers.AnyAsync(f => f.FarmerId == cropListing.FarmerId && f.UserId == currentUserId);
            if (!isOwner) return Forbid();

            var (success, imageUrl, error) = await _imageStorageService.SaveCropImageAsync(image);
            if (!success)
            {
                return BadRequest(new { message = error });
            }

            // Remove previous image from storage if it exists
            if (!string.IsNullOrEmpty(cropListing.ImageUrl))
            {
                _imageStorageService.DeleteImage(cropListing.ImageUrl);
            }

            cropListing.ImageUrl = imageUrl;
            cropListing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new CropListingImageUploadResponseDto
            {
                CropListingId = cropListing.CropListingId,
                ImageUrl = imageUrl ?? string.Empty,
                Message = "Crop listing image uploaded successfully"
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Farmer,Admin")]
        public async Task<IActionResult> PutCropListing(int id, [FromBody] CropListingUpdateDto dto)
        {
            var cropListing = await _context.CropListings.FindAsync(id);
            if (cropListing == null) return NotFound();

            var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();

            var isAdmin = User.IsInRole("Admin");
            var isOwner = isAdmin || await _context.Farmers.AnyAsync(f => f.FarmerId == cropListing.FarmerId && f.UserId == currentUserId);
            if (!isOwner) return Forbid();

            if (dto.FarmerId.HasValue) cropListing.FarmerId = dto.FarmerId.Value;
            if (dto.CropId.HasValue) cropListing.CropId = dto.CropId.Value;
            if (dto.Quantity.HasValue) cropListing.Quantity = dto.Quantity.Value;
            if (!string.IsNullOrEmpty(dto.Unit)) cropListing.Unit = dto.Unit;
            if (!string.IsNullOrEmpty(dto.QualityGrade)) cropListing.QualityGrade = dto.QualityGrade;
            if (!string.IsNullOrEmpty(dto.Location)) cropListing.Location = dto.Location;
            if (!string.IsNullOrEmpty(dto.District)) cropListing.District = dto.District;
            if (!string.IsNullOrEmpty(dto.State)) cropListing.State = dto.State;
            if (!string.IsNullOrEmpty(dto.Pincode)) cropListing.Pincode = dto.Pincode;
            if (dto.ExpectedSellingDate.HasValue) cropListing.ExpectedSellingDate = dto.ExpectedSellingDate.Value;
            if (dto.AskingPrice.HasValue) cropListing.AskingPrice = dto.AskingPrice.Value;
            if (!string.IsNullOrEmpty(dto.ImageUrl) && !string.Equals(dto.ImageUrl, cropListing.ImageUrl, StringComparison.OrdinalIgnoreCase))
            {
                if (!string.IsNullOrEmpty(cropListing.ImageUrl))
                {
                    _imageStorageService.DeleteImage(cropListing.ImageUrl);
                }
                cropListing.ImageUrl = dto.ImageUrl;
            }
            if (dto.Status is not null)
            {
                if (!Enum.TryParse<CropListingStatus>(dto.Status, true, out var status) || !Enum.IsDefined(status))
                    return BadRequest(new { message = $"Invalid status '{dto.Status}'." });
                cropListing.Status = status;
            }
            cropListing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Farmer,Admin")]
        public async Task<IActionResult> DeleteCropListing(int id)
        {
            var cropListing = await _context.CropListings.FindAsync(id);
            if (cropListing == null) return NotFound();

            var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();

            var isAdmin = User.IsInRole("Admin");
            var isOwner = isAdmin || await _context.Farmers.AnyAsync(f => f.FarmerId == cropListing.FarmerId && f.UserId == currentUserId);
            if (!isOwner) return Forbid();

            // Clean up associated image file from disk
            if (!string.IsNullOrEmpty(cropListing.ImageUrl))
            {
                _imageStorageService.DeleteImage(cropListing.ImageUrl);
            }

            _context.CropListings.Remove(cropListing);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
