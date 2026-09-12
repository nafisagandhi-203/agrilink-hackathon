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
[Authorize]
[ApiController]
public class NotificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateNotificationDto> _createValidator;
    private readonly IValidator<UpdateNotificationDto> _updateValidator;

public NotificationsController(ApplicationDbContext context, IValidator<CreateNotificationDto> createValidator, IValidator<UpdateNotificationDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Notifications
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<NotificationDto>>>> GetNotifications()
    {
        var entities = await _context.Notifications.ToListAsync();
            
        var dtos = entities.Select(e => new NotificationDto
        {
            NotificationId = e.NotificationId,
            UserId = e.UserId,
            NotificationType = e.NotificationType,
            Title = e.Title,
            Message = e.Message,
            IsRead = e.IsRead,
            CreatedAt = e.CreatedAt,
        });

        return Ok(ApiResponse<IEnumerable<NotificationDto>>.SuccessResponse(dtos, "Notification retrieved successfully"));
    }

    // GET: api/Notifications/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<NotificationDto>>> GetNotification(int id)
    {
        var entity = await _context.Notifications.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<NotificationDto>.ErrorResponse("Notification not found"));

        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId) || entity.UserId != currentUserId) return Forbid();

        var dto = new NotificationDto
        {
            NotificationId = entity.NotificationId,
            UserId = entity.UserId,
            NotificationType = entity.NotificationType,
            Title = entity.Title,
            Message = entity.Message,
            IsRead = entity.IsRead,
            CreatedAt = entity.CreatedAt,
        };

        return Ok(ApiResponse<NotificationDto>.SuccessResponse(dto, "Notification retrieved successfully"));
    }

    // POST: api/Notifications
    [HttpPost]
    public async Task<ActionResult<ApiResponse<NotificationDto>>> PostNotification(CreateNotificationDto createDto)
    {
        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId) || createDto.UserId != currentUserId) return Forbid();

        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new Notification
        {
            UserId = createDto.UserId,
            NotificationType = createDto.NotificationType,
            Title = createDto.Title,
            Message = createDto.Message,
            IsRead = createDto.IsRead,
            CreatedAt = System.DateTime.UtcNow,
        };
        
        _context.Notifications.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new NotificationDto
        {
            NotificationId = entity.NotificationId,
            UserId = entity.UserId,
            NotificationType = entity.NotificationType,
            Title = entity.Title,
            Message = entity.Message,
            IsRead = entity.IsRead,
            CreatedAt = entity.CreatedAt,
        };
        
        return CreatedAtAction(nameof(GetNotification), new { id = entity.NotificationId }, ApiResponse<NotificationDto>.SuccessResponse(returnDto, "Notification created successfully"));
    }

    // PUT: api/Notifications/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutNotification(int id, UpdateNotificationDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Notifications.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Notification not found"));

        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId) || entity.UserId != currentUserId) return Forbid();

        entity.NotificationType = updateDto.NotificationType;
        entity.Title = updateDto.Title;
        entity.Message = updateDto.Message;
        entity.IsRead = updateDto.IsRead;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Notification updated successfully"));
    }

    // DELETE: api/Notifications/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteNotification(int id)
    {
        var entity = await _context.Notifications.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Notification not found"));

        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId) || entity.UserId != currentUserId) return Forbid();

        _context.Notifications.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Notification deleted successfully"));
    }
}




