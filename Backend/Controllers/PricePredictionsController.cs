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
[Authorize]
[ApiController]
public class PricePredictionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreatePricePredictionDto> _createValidator;
    private readonly IValidator<UpdatePricePredictionDto> _updateValidator;

public PricePredictionsController(ApplicationDbContext context, IValidator<CreatePricePredictionDto> createValidator, IValidator<UpdatePricePredictionDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/PricePredictions
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<PricePredictionDto>>>> GetPricePredictions()
    {
        var entities = await _context.PricePredictions.ToListAsync();
            
        var dtos = entities.Select(e => new PricePredictionDto
        {
            PricePredictionId = e.PricePredictionId,
            CropId = e.CropId,
            Location = e.Location,
            QualityGrade = e.QualityGrade,
            Quantity = e.Quantity,
            CurrentMarketPrice = e.CurrentMarketPrice,
            FairPriceMin = e.FairPriceMin,
            FairPriceMax = e.FairPriceMax,
            PredictedPrice = e.PredictedPrice,
            PredictionDate = e.PredictionDate,
            PredictionForDate = e.PredictionForDate,
            ConfidenceScore = e.ConfidenceScore,
            ModelVersion = e.ModelVersion,
            CreatedAt = e.CreatedAt
        });

        return Ok(ApiResponse<IEnumerable<PricePredictionDto>>.SuccessResponse(dtos, "PricePrediction retrieved successfully"));
    }

    // GET: api/PricePredictions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PricePredictionDto>>> GetPricePrediction(int id)
    {
        var entity = await _context.PricePredictions.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<PricePredictionDto>.ErrorResponse("PricePrediction not found"));

        var dto = new PricePredictionDto
        {
            PricePredictionId = entity.PricePredictionId,
            CropId = entity.CropId,
            Location = entity.Location,
            QualityGrade = entity.QualityGrade,
            Quantity = entity.Quantity,
            CurrentMarketPrice = entity.CurrentMarketPrice,
            FairPriceMin = entity.FairPriceMin,
            FairPriceMax = entity.FairPriceMax,
            PredictedPrice = entity.PredictedPrice,
            PredictionDate = entity.PredictionDate,
            PredictionForDate = entity.PredictionForDate,
            ConfidenceScore = entity.ConfidenceScore,
            ModelVersion = entity.ModelVersion,
            CreatedAt = entity.CreatedAt
        };

        return Ok(ApiResponse<PricePredictionDto>.SuccessResponse(dto, "PricePrediction retrieved successfully"));
    }

    // POST: api/PricePredictions
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<PricePredictionDto>>> PostPricePrediction(CreatePricePredictionDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new PricePrediction
        {
            CropId = createDto.CropId,
            Location = createDto.Location,
            QualityGrade = createDto.QualityGrade,
            Quantity = createDto.Quantity,
            CurrentMarketPrice = createDto.CurrentMarketPrice,
            FairPriceMin = createDto.FairPriceMin,
            FairPriceMax = createDto.FairPriceMax,
            PredictedPrice = createDto.PredictedPrice,
            PredictionDate = createDto.PredictionDate,
            PredictionForDate = createDto.PredictionForDate,
            ConfidenceScore = createDto.ConfidenceScore,
            ModelVersion = createDto.ModelVersion,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.PricePredictions.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new PricePredictionDto
        {
            PricePredictionId = entity.PricePredictionId,
            CropId = entity.CropId,
            Location = entity.Location,
            QualityGrade = entity.QualityGrade,
            Quantity = entity.Quantity,
            CurrentMarketPrice = entity.CurrentMarketPrice,
            FairPriceMin = entity.FairPriceMin,
            FairPriceMax = entity.FairPriceMax,
            PredictedPrice = entity.PredictedPrice,
            PredictionDate = entity.PredictionDate,
            PredictionForDate = entity.PredictionForDate,
            ConfidenceScore = entity.ConfidenceScore,
            ModelVersion = entity.ModelVersion,
            CreatedAt = entity.CreatedAt
        };
        
        return CreatedAtAction(nameof(GetPricePrediction), new { id = entity.PricePredictionId }, ApiResponse<PricePredictionDto>.SuccessResponse(returnDto, "PricePrediction created successfully"));
    }

    // PUT: api/PricePredictions/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutPricePrediction(int id, UpdatePricePredictionDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.PricePredictions.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("PricePrediction not found"));

        entity.CropId = updateDto.CropId;
        entity.Location = updateDto.Location;
        entity.QualityGrade = updateDto.QualityGrade;
        entity.Quantity = updateDto.Quantity;
        entity.CurrentMarketPrice = updateDto.CurrentMarketPrice;
        entity.FairPriceMin = updateDto.FairPriceMin;
        entity.FairPriceMax = updateDto.FairPriceMax;
        entity.PredictedPrice = updateDto.PredictedPrice;
        entity.PredictionDate = updateDto.PredictionDate;
        entity.PredictionForDate = updateDto.PredictionForDate;
        entity.ConfidenceScore = updateDto.ConfidenceScore;
        entity.ModelVersion = updateDto.ModelVersion;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "PricePrediction updated successfully"));
    }

    // DELETE: api/PricePredictions/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeletePricePrediction(int id)
    {
        var entity = await _context.PricePredictions.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("PricePrediction not found"));

        _context.PricePredictions.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "PricePrediction deleted successfully"));
    }
}


