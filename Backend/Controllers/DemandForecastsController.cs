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
public class DemandForecastsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateDemandForecastDto> _createValidator;
    private readonly IValidator<UpdateDemandForecastDto> _updateValidator;

public DemandForecastsController(ApplicationDbContext context, IValidator<CreateDemandForecastDto> createValidator, IValidator<UpdateDemandForecastDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/DemandForecasts
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<DemandForecastDto>>>> GetDemandForecasts()
    {
        var entities = await _context.DemandForecasts.ToListAsync();
            
        var dtos = entities.Select(e => new DemandForecastDto
        {
            DemandForecastId = e.DemandForecastId,
            CropId = e.CropId,
            Location = e.Location,
            ForecastDate = e.ForecastDate,
            ForecastForDate = e.ForecastForDate,
            PredictedDemand = e.PredictedDemand,
            DemandUnit = e.DemandUnit,
            DemandTrend = e.DemandTrend,
            ConfidenceScore = e.ConfidenceScore,
            ModelVersion = e.ModelVersion,
            CreatedAt = e.CreatedAt
        });

        return Ok(ApiResponse<IEnumerable<DemandForecastDto>>.SuccessResponse(dtos, "DemandForecast retrieved successfully"));
    }

    // GET: api/DemandForecasts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<DemandForecastDto>>> GetDemandForecast(int id)
    {
        var entity = await _context.DemandForecasts.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<DemandForecastDto>.ErrorResponse("DemandForecast not found"));

        var dto = new DemandForecastDto
        {
            DemandForecastId = entity.DemandForecastId,
            CropId = entity.CropId,
            Location = entity.Location,
            ForecastDate = entity.ForecastDate,
            ForecastForDate = entity.ForecastForDate,
            PredictedDemand = entity.PredictedDemand,
            DemandUnit = entity.DemandUnit,
            DemandTrend = entity.DemandTrend,
            ConfidenceScore = entity.ConfidenceScore,
            ModelVersion = entity.ModelVersion,
            CreatedAt = entity.CreatedAt
        };

        return Ok(ApiResponse<DemandForecastDto>.SuccessResponse(dto, "DemandForecast retrieved successfully"));
    }

    // POST: api/DemandForecasts
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<DemandForecastDto>>> PostDemandForecast(CreateDemandForecastDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new DemandForecast
        {
            CropId = createDto.CropId,
            Location = createDto.Location,
            ForecastDate = createDto.ForecastDate,
            ForecastForDate = createDto.ForecastForDate,
            PredictedDemand = createDto.PredictedDemand,
            DemandUnit = createDto.DemandUnit,
            DemandTrend = createDto.DemandTrend,
            ConfidenceScore = createDto.ConfidenceScore,
            ModelVersion = createDto.ModelVersion,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.DemandForecasts.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new DemandForecastDto
        {
            DemandForecastId = entity.DemandForecastId,
            CropId = entity.CropId,
            Location = entity.Location,
            ForecastDate = entity.ForecastDate,
            ForecastForDate = entity.ForecastForDate,
            PredictedDemand = entity.PredictedDemand,
            DemandUnit = entity.DemandUnit,
            DemandTrend = entity.DemandTrend,
            ConfidenceScore = entity.ConfidenceScore,
            ModelVersion = entity.ModelVersion,
            CreatedAt = entity.CreatedAt
        };
        
        return CreatedAtAction(nameof(GetDemandForecast), new { id = entity.DemandForecastId }, ApiResponse<DemandForecastDto>.SuccessResponse(returnDto, "DemandForecast created successfully"));
    }

    // PUT: api/DemandForecasts/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutDemandForecast(int id, UpdateDemandForecastDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.DemandForecasts.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("DemandForecast not found"));

        entity.CropId = updateDto.CropId;
        entity.Location = updateDto.Location;
        entity.ForecastDate = updateDto.ForecastDate;
        entity.ForecastForDate = updateDto.ForecastForDate;
        entity.PredictedDemand = updateDto.PredictedDemand;
        entity.DemandUnit = updateDto.DemandUnit;
        entity.DemandTrend = updateDto.DemandTrend;
        entity.ConfidenceScore = updateDto.ConfidenceScore;
        entity.ModelVersion = updateDto.ModelVersion;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "DemandForecast updated successfully"));
    }

    // DELETE: api/DemandForecasts/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteDemandForecast(int id)
    {
        var entity = await _context.DemandForecasts.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("DemandForecast not found"));

        _context.DemandForecasts.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "DemandForecast deleted successfully"));
    }
}


