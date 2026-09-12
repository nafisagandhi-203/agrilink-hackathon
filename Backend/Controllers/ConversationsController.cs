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
[Authorize(Roles = "Farmer,Buyer")]
[ApiController]
public class ConversationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateConversationDto> _createValidator;
    private readonly IValidator<UpdateConversationDto> _updateValidator;

public ConversationsController(ApplicationDbContext context, IValidator<CreateConversationDto> createValidator, IValidator<UpdateConversationDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Conversations
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ConversationDto>>>> GetConversations()
    {
        var entities = await _context.Conversations.ToListAsync();
            
        var dtos = entities.Select(e => new ConversationDto
        {
            ConversationId = e.ConversationId,
            FarmerId = e.FarmerId,
            BuyerId = e.BuyerId,
            CropListingId = e.CropListingId,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
        });

        return Ok(ApiResponse<IEnumerable<ConversationDto>>.SuccessResponse(dtos, "Conversation retrieved successfully"));
    }

    // GET: api/Conversations/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ConversationDto>>> GetConversation(int id)
    {
        var entity = await _context.Conversations.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<ConversationDto>.ErrorResponse("Conversation not found"));

        var dto = new ConversationDto
        {
            ConversationId = entity.ConversationId,
            FarmerId = entity.FarmerId,
            BuyerId = entity.BuyerId,
            CropListingId = entity.CropListingId,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
        };

        return Ok(ApiResponse<ConversationDto>.SuccessResponse(dto, "Conversation retrieved successfully"));
    }

    // POST: api/Conversations
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ConversationDto>>> PostConversation(CreateConversationDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new Conversation
        {
            FarmerId = createDto.FarmerId,
            BuyerId = createDto.BuyerId,
            CropListingId = createDto.CropListingId,
            CreatedAt = System.DateTime.UtcNow,
        };
        
        _context.Conversations.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new ConversationDto
        {
            ConversationId = entity.ConversationId,
            FarmerId = entity.FarmerId,
            BuyerId = entity.BuyerId,
            CropListingId = entity.CropListingId,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
        };
        
        return CreatedAtAction(nameof(GetConversation), new { id = entity.ConversationId }, ApiResponse<ConversationDto>.SuccessResponse(returnDto, "Conversation created successfully"));
    }

    // PUT: api/Conversations/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutConversation(int id, UpdateConversationDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Conversations.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Conversation not found"));

        entity.UpdatedAt = System.DateTime.UtcNow;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Conversation updated successfully"));
    }

    // DELETE: api/Conversations/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteConversation(int id)
    {
        var entity = await _context.Conversations.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Conversation not found"));

        _context.Conversations.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Conversation deleted successfully"));
    }
}


