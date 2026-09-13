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
[Authorize(Roles = "Farmer")]
[ApiController]
public class SellingInsightsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateSellingInsightDto> _createValidator;
    private readonly IValidator<UpdateSellingInsightDto> _updateValidator;

public SellingInsightsController(ApplicationDbContext context, IValidator<CreateSellingInsightDto> createValidator, IValidator<UpdateSellingInsightDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/SellingInsights
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<SellingInsightDto>>>> GetSellingInsights()
    {
        var userId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid)
            ? uid
            : (int?)null;
        if (userId == null) return Unauthorized();

        var farmerId = await _context.Farmers
            .Where(f => f.UserId == userId.Value)
            .Select(f => (int?)f.FarmerId)
            .FirstOrDefaultAsync();
        if (farmerId == null) return Forbid();

        var entities = await _context.SellingInsights
            .Where(e => e.CropListing != null && e.CropListing.FarmerId == farmerId.Value)
            .ToListAsync();
            
        var dtos = entities.Select(e => new SellingInsightDto
        {
            SellingInsightId = e.SellingInsightId,
            CropListingId = e.CropListingId,
            CurrentPrice = e.CurrentPrice,
            FairPrice = e.FairPrice,
            PredictedFuturePrice = e.PredictedFuturePrice,
            Recommendation = e.Recommendation,
            Reason = e.Reason,
            ConfidenceScore = e.ConfidenceScore,
            GeneratedAt = e.GeneratedAt
        });

        return Ok(ApiResponse<IEnumerable<SellingInsightDto>>.SuccessResponse(dtos, "SellingInsight retrieved successfully"));
    }

    // GET: api/SellingInsights/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<SellingInsightDto>>> GetSellingInsight(int id)
    {
        var entity = await _context.SellingInsights.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<SellingInsightDto>.ErrorResponse("SellingInsight not found"));

        var dto = new SellingInsightDto
        {
            SellingInsightId = entity.SellingInsightId,
            CropListingId = entity.CropListingId,
            CurrentPrice = entity.CurrentPrice,
            FairPrice = entity.FairPrice,
            PredictedFuturePrice = entity.PredictedFuturePrice,
            Recommendation = entity.Recommendation,
            Reason = entity.Reason,
            ConfidenceScore = entity.ConfidenceScore,
            GeneratedAt = entity.GeneratedAt
        };

        return Ok(ApiResponse<SellingInsightDto>.SuccessResponse(dto, "SellingInsight retrieved successfully"));
    }

    // POST: api/SellingInsights
    [HttpPost]
    public async Task<ActionResult<ApiResponse<SellingInsightDto>>> PostSellingInsight(CreateSellingInsightDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new SellingInsight
        {
            CropListingId = createDto.CropListingId,
            CurrentPrice = createDto.CurrentPrice,
            FairPrice = createDto.FairPrice,
            PredictedFuturePrice = createDto.PredictedFuturePrice,
            Recommendation = createDto.Recommendation,
            Reason = createDto.Reason,
            ConfidenceScore = createDto.ConfidenceScore,
            GeneratedAt = DateTime.UtcNow
        };
        
        _context.SellingInsights.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new SellingInsightDto
        {
            SellingInsightId = entity.SellingInsightId,
            CropListingId = entity.CropListingId,
            CurrentPrice = entity.CurrentPrice,
            FairPrice = entity.FairPrice,
            PredictedFuturePrice = entity.PredictedFuturePrice,
            Recommendation = entity.Recommendation,
            Reason = entity.Reason,
            ConfidenceScore = entity.ConfidenceScore,
            GeneratedAt = entity.GeneratedAt
        };
        
        return CreatedAtAction(nameof(GetSellingInsight), new { id = entity.SellingInsightId }, ApiResponse<SellingInsightDto>.SuccessResponse(returnDto, "SellingInsight created successfully"));
    }

    // PUT: api/SellingInsights/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutSellingInsight(int id, UpdateSellingInsightDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.SellingInsights.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("SellingInsight not found"));

        entity.CropListingId = updateDto.CropListingId;
        entity.CurrentPrice = updateDto.CurrentPrice;
        entity.FairPrice = updateDto.FairPrice;
        entity.PredictedFuturePrice = updateDto.PredictedFuturePrice;
        entity.Recommendation = updateDto.Recommendation;
        entity.Reason = updateDto.Reason;
        entity.ConfidenceScore = updateDto.ConfidenceScore;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "SellingInsight updated successfully"));
    }

    // DELETE: api/SellingInsights/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteSellingInsight(int id)
    {
        var entity = await _context.SellingInsights.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("SellingInsight not found"));

        _context.SellingInsights.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "SellingInsight deleted successfully"));
    }
}

