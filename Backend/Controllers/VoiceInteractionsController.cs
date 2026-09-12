using Microsoft.AspNetCore.Authorization;
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

namespace Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "Farmer")]
[ApiController]
public class VoiceInteractionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateVoiceInteractionDto> _createValidator;
    private readonly IValidator<UpdateVoiceInteractionDto> _updateValidator;

public VoiceInteractionsController(ApplicationDbContext context, IValidator<CreateVoiceInteractionDto> createValidator, IValidator<UpdateVoiceInteractionDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/VoiceInteractions
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<VoiceInteractionDto>>>> GetVoiceInteractions()
    {
        var entities = await _context.VoiceInteractions.ToListAsync();
            
        var dtos = entities.Select(e => new VoiceInteractionDto
        {
            VoiceInteractionId = e.VoiceInteractionId,
            UserId = e.UserId,
            Language = e.Language,
            RecognizedText = e.RecognizedText,
            Intent = e.Intent,
            ResponseText = e.ResponseText,
            CreatedAt = e.CreatedAt,
        });

        return Ok(ApiResponse<IEnumerable<VoiceInteractionDto>>.SuccessResponse(dtos, "VoiceInteraction retrieved successfully"));
    }

    // GET: api/VoiceInteractions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<VoiceInteractionDto>>> GetVoiceInteraction(int id)
    {
        var entity = await _context.VoiceInteractions.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<VoiceInteractionDto>.ErrorResponse("VoiceInteraction not found"));

        var dto = new VoiceInteractionDto
        {
            VoiceInteractionId = entity.VoiceInteractionId,
            UserId = entity.UserId,
            Language = entity.Language,
            RecognizedText = entity.RecognizedText,
            Intent = entity.Intent,
            ResponseText = entity.ResponseText,
            CreatedAt = entity.CreatedAt,
        };

        return Ok(ApiResponse<VoiceInteractionDto>.SuccessResponse(dto, "VoiceInteraction retrieved successfully"));
    }

    // POST: api/VoiceInteractions
    [HttpPost]
    public async Task<ActionResult<ApiResponse<VoiceInteractionDto>>> PostVoiceInteraction(CreateVoiceInteractionDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new VoiceInteraction
        {
            UserId = createDto.UserId,
            Language = createDto.Language,
            RecognizedText = createDto.RecognizedText,
            Intent = createDto.Intent,
            ResponseText = createDto.ResponseText,
            CreatedAt = System.DateTime.UtcNow,
        };
        
        _context.VoiceInteractions.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new VoiceInteractionDto
        {
            VoiceInteractionId = entity.VoiceInteractionId,
            UserId = entity.UserId,
            Language = entity.Language,
            RecognizedText = entity.RecognizedText,
            Intent = entity.Intent,
            ResponseText = entity.ResponseText,
            CreatedAt = entity.CreatedAt,
        };
        
        return CreatedAtAction(nameof(GetVoiceInteraction), new { id = entity.VoiceInteractionId }, ApiResponse<VoiceInteractionDto>.SuccessResponse(returnDto, "VoiceInteraction created successfully"));
    }

    // PUT: api/VoiceInteractions/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutVoiceInteraction(int id, UpdateVoiceInteractionDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.VoiceInteractions.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("VoiceInteraction not found"));

        entity.Language = updateDto.Language;
        entity.RecognizedText = updateDto.RecognizedText;
        entity.Intent = updateDto.Intent;
        entity.ResponseText = updateDto.ResponseText;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "VoiceInteraction updated successfully"));
    }

    // DELETE: api/VoiceInteractions/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteVoiceInteraction(int id)
    {
        var entity = await _context.VoiceInteractions.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("VoiceInteraction not found"));

        _context.VoiceInteractions.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "VoiceInteraction deleted successfully"));
    }
}




