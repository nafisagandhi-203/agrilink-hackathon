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
[Authorize(Roles = "Farmer,Buyer,Admin")]
[ApiController]
public class AbnormalPriceAlertsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateAbnormalPriceAlertDto> _createValidator;
    private readonly IValidator<UpdateAbnormalPriceAlertDto> _updateValidator;

public AbnormalPriceAlertsController(ApplicationDbContext context, IValidator<CreateAbnormalPriceAlertDto> createValidator, IValidator<UpdateAbnormalPriceAlertDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/AbnormalPriceAlerts
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<AbnormalPriceAlertDto>>>> GetAbnormalPriceAlerts()
    {
        var entities = await _context.AbnormalPriceAlerts.ToListAsync();
            
        var dtos = entities.Select(e => new AbnormalPriceAlertDto
        {
            AlertId = e.AlertId,
            CropListingId = e.CropListingId,
            BuyerId = e.BuyerId,
            OfferId = e.OfferId,
            ExpectedPrice = e.ExpectedPrice,
            OfferedPrice = e.OfferedPrice,
            DifferencePercentage = e.DifferencePercentage,
            AlertType = e.AlertType,
            Message = e.Message,
            IsRead = e.IsRead,
            CreatedAt = e.CreatedAt
        });

        return Ok(ApiResponse<IEnumerable<AbnormalPriceAlertDto>>.SuccessResponse(dtos, "AbnormalPriceAlert retrieved successfully"));
    }

    // GET: api/AbnormalPriceAlerts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<AbnormalPriceAlertDto>>> GetAbnormalPriceAlert(int id)
    {
        var entity = await _context.AbnormalPriceAlerts.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<AbnormalPriceAlertDto>.ErrorResponse("AbnormalPriceAlert not found"));

        var dto = new AbnormalPriceAlertDto
        {
            AlertId = entity.AlertId,
            CropListingId = entity.CropListingId,
            BuyerId = entity.BuyerId,
            OfferId = entity.OfferId,
            ExpectedPrice = entity.ExpectedPrice,
            OfferedPrice = entity.OfferedPrice,
            DifferencePercentage = entity.DifferencePercentage,
            AlertType = entity.AlertType,
            Message = entity.Message,
            IsRead = entity.IsRead,
            CreatedAt = entity.CreatedAt
        };

        return Ok(ApiResponse<AbnormalPriceAlertDto>.SuccessResponse(dto, "AbnormalPriceAlert retrieved successfully"));
    }

    // POST: api/AbnormalPriceAlerts
    [HttpPost]
    public async Task<ActionResult<ApiResponse<AbnormalPriceAlertDto>>> PostAbnormalPriceAlert(CreateAbnormalPriceAlertDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new AbnormalPriceAlert
        {
            CropListingId = createDto.CropListingId,
            BuyerId = createDto.BuyerId,
            OfferId = createDto.OfferId,
            ExpectedPrice = createDto.ExpectedPrice,
            OfferedPrice = createDto.OfferedPrice,
            DifferencePercentage = createDto.DifferencePercentage,
            AlertType = createDto.AlertType,
            Message = createDto.Message,
            IsRead = createDto.IsRead,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.AbnormalPriceAlerts.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new AbnormalPriceAlertDto
        {
            AlertId = entity.AlertId,
            CropListingId = entity.CropListingId,
            BuyerId = entity.BuyerId,
            OfferId = entity.OfferId,
            ExpectedPrice = entity.ExpectedPrice,
            OfferedPrice = entity.OfferedPrice,
            DifferencePercentage = entity.DifferencePercentage,
            AlertType = entity.AlertType,
            Message = entity.Message,
            IsRead = entity.IsRead,
            CreatedAt = entity.CreatedAt
        };
        
        return CreatedAtAction(nameof(GetAbnormalPriceAlert), new { id = entity.AlertId }, ApiResponse<AbnormalPriceAlertDto>.SuccessResponse(returnDto, "AbnormalPriceAlert created successfully"));
    }

    // PUT: api/AbnormalPriceAlerts/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutAbnormalPriceAlert(int id, UpdateAbnormalPriceAlertDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.AbnormalPriceAlerts.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("AbnormalPriceAlert not found"));

        entity.CropListingId = updateDto.CropListingId;
        entity.BuyerId = updateDto.BuyerId;
        entity.OfferId = updateDto.OfferId;
        entity.ExpectedPrice = updateDto.ExpectedPrice;
        entity.OfferedPrice = updateDto.OfferedPrice;
        entity.DifferencePercentage = updateDto.DifferencePercentage;
        entity.AlertType = updateDto.AlertType;
        entity.Message = updateDto.Message;
        entity.IsRead = updateDto.IsRead;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "AbnormalPriceAlert updated successfully"));
    }

    // DELETE: api/AbnormalPriceAlerts/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteAbnormalPriceAlert(int id)
    {
        var entity = await _context.AbnormalPriceAlerts.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("AbnormalPriceAlert not found"));

        _context.AbnormalPriceAlerts.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "AbnormalPriceAlert deleted successfully"));
    }
}

