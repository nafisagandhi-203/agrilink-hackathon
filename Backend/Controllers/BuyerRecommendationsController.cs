using System.Security.Claims;
using System.Linq;
using FluentValidation;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using DTOs;
using System.Linq;
using System;
using Microsoft.AspNetCore.Authorization;

namespace Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "Buyer")]
[ApiController]
public class BuyerRecommendationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly Services.BuyerRecommendationService _recommendationService;

    

        private readonly IValidator<CreateBuyerRecommendationDto> _createValidator;
    private readonly IValidator<UpdateBuyerRecommendationDto> _updateValidator;

public BuyerRecommendationsController(ApplicationDbContext context, Services.BuyerRecommendationService recommendationService, IValidator<CreateBuyerRecommendationDto> createValidator, IValidator<UpdateBuyerRecommendationDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
        _recommendationService = recommendationService;
    }

    // GET: api/BuyerRecommendations
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<BuyerRecommendationDto>>>> GetBuyerRecommendations()
    {
        var userId = int.TryParse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier), out var uid)
            ? uid
            : (int?)null;
        if (userId == null) return Unauthorized();

        var buyerId = await _context.Buyers
            .Where(b => b.UserId == userId.Value)
            .Select(b => (int?)b.BuyerId)
            .FirstOrDefaultAsync();
        if (buyerId == null) return Forbid();

        await _recommendationService.EnsureRecommendationsAsync();

        var entities = await _context.BuyerRecommendations
            .Where(e => e.BuyerId == buyerId.Value)
            .ToListAsync();
            
        var dtos = entities.Select(e => new BuyerRecommendationDto
        {
            BuyerRecommendationId = e.BuyerRecommendationId,
            CropListingId = e.CropListingId,
            BuyerId = e.BuyerId,
            CompatibilityScore = e.CompatibilityScore,
            CropMatchScore = e.CropMatchScore,
            QuantityMatchScore = e.QuantityMatchScore,
            QualityMatchScore = e.QualityMatchScore,
            LocationMatchScore = e.LocationMatchScore,
            PriceMatchScore = e.PriceMatchScore,
            DateMatchScore = e.DateMatchScore,
            RecommendationReason = e.RecommendationReason,
            GeneratedAt = e.GeneratedAt
        });

        return Ok(ApiResponse<IEnumerable<BuyerRecommendationDto>>.SuccessResponse(dtos, "BuyerRecommendation retrieved successfully"));
    }

    // GET: api/BuyerRecommendations/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<BuyerRecommendationDto>>> GetBuyerRecommendation(int id)
    {
        var entity = await _context.BuyerRecommendations.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<BuyerRecommendationDto>.ErrorResponse("BuyerRecommendation not found"));

        var dto = new BuyerRecommendationDto
        {
            BuyerRecommendationId = entity.BuyerRecommendationId,
            CropListingId = entity.CropListingId,
            BuyerId = entity.BuyerId,
            CompatibilityScore = entity.CompatibilityScore,
            CropMatchScore = entity.CropMatchScore,
            QuantityMatchScore = entity.QuantityMatchScore,
            QualityMatchScore = entity.QualityMatchScore,
            LocationMatchScore = entity.LocationMatchScore,
            PriceMatchScore = entity.PriceMatchScore,
            DateMatchScore = entity.DateMatchScore,
            RecommendationReason = entity.RecommendationReason,
            GeneratedAt = entity.GeneratedAt
        };

        return Ok(ApiResponse<BuyerRecommendationDto>.SuccessResponse(dto, "BuyerRecommendation retrieved successfully"));
    }

    // POST: api/BuyerRecommendations
    [HttpPost]
    public async Task<ActionResult<ApiResponse<BuyerRecommendationDto>>> PostBuyerRecommendation(CreateBuyerRecommendationDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var duplicate = await _context.BuyerRecommendations.AnyAsync(e =>
            e.CropListingId == createDto.CropListingId && e.BuyerId == createDto.BuyerId);
        if (duplicate)
        {
            return Conflict(DTOs.ApiResponse<object>.ErrorResponse("A recommendation already exists for this crop listing and buyer."));
        }

        var entity = new BuyerRecommendation
        {
            CropListingId = createDto.CropListingId,
            BuyerId = createDto.BuyerId,
            CompatibilityScore = createDto.CompatibilityScore,
            CropMatchScore = createDto.CropMatchScore,
            QuantityMatchScore = createDto.QuantityMatchScore,
            QualityMatchScore = createDto.QualityMatchScore,
            LocationMatchScore = createDto.LocationMatchScore,
            PriceMatchScore = createDto.PriceMatchScore,
            DateMatchScore = createDto.DateMatchScore,
            RecommendationReason = createDto.RecommendationReason,
            GeneratedAt = DateTime.UtcNow
        };
        
        _context.BuyerRecommendations.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new BuyerRecommendationDto
        {
            BuyerRecommendationId = entity.BuyerRecommendationId,
            CropListingId = entity.CropListingId,
            BuyerId = entity.BuyerId,
            CompatibilityScore = entity.CompatibilityScore,
            CropMatchScore = entity.CropMatchScore,
            QuantityMatchScore = entity.QuantityMatchScore,
            QualityMatchScore = entity.QualityMatchScore,
            LocationMatchScore = entity.LocationMatchScore,
            PriceMatchScore = entity.PriceMatchScore,
            DateMatchScore = entity.DateMatchScore,
            RecommendationReason = entity.RecommendationReason,
            GeneratedAt = entity.GeneratedAt
        };
        
        return CreatedAtAction(nameof(GetBuyerRecommendation), new { id = entity.BuyerRecommendationId }, ApiResponse<BuyerRecommendationDto>.SuccessResponse(returnDto, "BuyerRecommendation created successfully"));
    }

    // PUT: api/BuyerRecommendations/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutBuyerRecommendation(int id, UpdateBuyerRecommendationDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.BuyerRecommendations.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("BuyerRecommendation not found"));

        entity.CropListingId = updateDto.CropListingId;
        entity.BuyerId = updateDto.BuyerId;
        entity.CompatibilityScore = updateDto.CompatibilityScore;
        entity.CropMatchScore = updateDto.CropMatchScore;
        entity.QuantityMatchScore = updateDto.QuantityMatchScore;
        entity.QualityMatchScore = updateDto.QualityMatchScore;
        entity.LocationMatchScore = updateDto.LocationMatchScore;
        entity.PriceMatchScore = updateDto.PriceMatchScore;
        entity.DateMatchScore = updateDto.DateMatchScore;
        entity.RecommendationReason = updateDto.RecommendationReason;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "BuyerRecommendation updated successfully"));
    }

    // DELETE: api/BuyerRecommendations/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteBuyerRecommendation(int id)
    {
        var entity = await _context.BuyerRecommendations.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("BuyerRecommendation not found"));

        _context.BuyerRecommendations.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "BuyerRecommendation deleted successfully"));
    }
}

