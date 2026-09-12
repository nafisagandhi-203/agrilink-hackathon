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
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateMessageDto> _createValidator;
    private readonly IValidator<UpdateMessageDto> _updateValidator;

public MessagesController(ApplicationDbContext context, IValidator<CreateMessageDto> createValidator, IValidator<UpdateMessageDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Messages
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<MessageDto>>>> GetMessages()
    {
        var entities = await _context.Messages.ToListAsync();
            
        var dtos = entities.Select(e => new MessageDto
        {
            MessageId = e.MessageId,
            ConversationId = e.ConversationId,
            SenderUserId = e.SenderUserId,
            MessageText = e.MessageText,
            SentAt = e.SentAt,
            IsRead = e.IsRead,
        });

        return Ok(ApiResponse<IEnumerable<MessageDto>>.SuccessResponse(dtos, "Message retrieved successfully"));
    }

    // GET: api/Messages/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<MessageDto>>> GetMessage(int id)
    {
        var entity = await _context.Messages.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<MessageDto>.ErrorResponse("Message not found"));

        var dto = new MessageDto
        {
            MessageId = entity.MessageId,
            ConversationId = entity.ConversationId,
            SenderUserId = entity.SenderUserId,
            MessageText = entity.MessageText,
            SentAt = entity.SentAt,
            IsRead = entity.IsRead,
        };

        return Ok(ApiResponse<MessageDto>.SuccessResponse(dto, "Message retrieved successfully"));
    }

    // POST: api/Messages
    [HttpPost]
    public async Task<ActionResult<ApiResponse<MessageDto>>> PostMessage(CreateMessageDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new Message
        {
            ConversationId = createDto.ConversationId,
            SenderUserId = createDto.SenderUserId,
            MessageText = createDto.MessageText,
            IsRead = createDto.IsRead,
            SentAt = System.DateTime.UtcNow,
        };
        
        _context.Messages.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new MessageDto
        {
            MessageId = entity.MessageId,
            ConversationId = entity.ConversationId,
            SenderUserId = entity.SenderUserId,
            MessageText = entity.MessageText,
            SentAt = entity.SentAt,
            IsRead = entity.IsRead,
        };
        
        return CreatedAtAction(nameof(GetMessage), new { id = entity.MessageId }, ApiResponse<MessageDto>.SuccessResponse(returnDto, "Message created successfully"));
    }

    // PUT: api/Messages/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutMessage(int id, UpdateMessageDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Messages.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Message not found"));

        entity.MessageText = updateDto.MessageText;
        entity.IsRead = updateDto.IsRead;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Message updated successfully"));
    }

    // DELETE: api/Messages/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteMessage(int id)
    {
        var entity = await _context.Messages.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Message not found"));

        _context.Messages.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Message deleted successfully"));
    }
}


