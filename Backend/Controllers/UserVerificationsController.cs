using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using FluentValidation;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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
[Authorize(Roles = "Admin")]
[ApiController]
public class UserVerificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateUserVerificationDto> _createValidator;
    private readonly IValidator<UpdateUserVerificationDto> _updateValidator;

public UserVerificationsController(ApplicationDbContext context, IValidator<CreateUserVerificationDto> createValidator, IValidator<UpdateUserVerificationDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/UserVerifications
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserVerificationDto>>>> GetUserVerifications()
    {
        var entities = await _context.UserVerifications.ToListAsync();
            
        var dtos = entities.Select(e => new UserVerificationDto
        {
            UserVerificationId = e.UserVerificationId,
            UserId = e.UserId,
            VerificationStatus = e.VerificationStatus,
            VerifiedByUserId = e.VerifiedByUserId,
            VerifiedAt = e.VerifiedAt,
            Remarks = e.Remarks,
        });

        return Ok(ApiResponse<IEnumerable<UserVerificationDto>>.SuccessResponse(dtos, "UserVerification retrieved successfully"));
    }

    // GET: api/UserVerifications/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserVerificationDto>>> GetUserVerification(int id)
    {
        var entity = await _context.UserVerifications.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<UserVerificationDto>.ErrorResponse("UserVerification not found"));

        var dto = new UserVerificationDto
        {
            UserVerificationId = entity.UserVerificationId,
            UserId = entity.UserId,
            VerificationStatus = entity.VerificationStatus,
            VerifiedByUserId = entity.VerifiedByUserId,
            VerifiedAt = entity.VerifiedAt,
            Remarks = entity.Remarks,
        };

        return Ok(ApiResponse<UserVerificationDto>.SuccessResponse(dto, "UserVerification retrieved successfully"));
    }

    // POST: api/UserVerifications
    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserVerificationDto>>> PostUserVerification(CreateUserVerificationDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new UserVerification
        {
            UserId = createDto.UserId,
            VerificationStatus = createDto.VerificationStatus,
            VerifiedByUserId = createDto.VerifiedByUserId,
            VerifiedAt = createDto.VerifiedAt,
            Remarks = createDto.Remarks,
        };
        
        _context.UserVerifications.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new UserVerificationDto
        {
            UserVerificationId = entity.UserVerificationId,
            UserId = entity.UserId,
            VerificationStatus = entity.VerificationStatus,
            VerifiedByUserId = entity.VerifiedByUserId,
            VerifiedAt = entity.VerifiedAt,
            Remarks = entity.Remarks,
        };
        
        return CreatedAtAction(nameof(GetUserVerification), new { id = entity.UserVerificationId }, ApiResponse<UserVerificationDto>.SuccessResponse(returnDto, "UserVerification created successfully"));
    }

    // PUT: api/UserVerifications/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutUserVerification(int id, UpdateUserVerificationDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.UserVerifications.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("UserVerification not found"));

        entity.VerificationStatus = updateDto.VerificationStatus;
        entity.VerifiedByUserId = updateDto.VerifiedByUserId;
        entity.VerifiedAt = updateDto.VerifiedAt;
        entity.Remarks = updateDto.Remarks;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "UserVerification updated successfully"));
    }

    // DELETE: api/UserVerifications/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUserVerification(int id)
    {
        var entity = await _context.UserVerifications.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("UserVerification not found"));

        _context.UserVerifications.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "UserVerification deleted successfully"));
    }
}

