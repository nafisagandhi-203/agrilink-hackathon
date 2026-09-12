using System.Linq;
using FluentValidation;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using DTOs;
using System.Linq;

namespace Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
[ApiController]
public class AdminsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateAdminDto> _createValidator;
    private readonly IValidator<UpdateAdminDto> _updateValidator;

public AdminsController(ApplicationDbContext context, IValidator<CreateAdminDto> createValidator, IValidator<UpdateAdminDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Admins
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<AdminDto>>>> GetAdmins()
    {
        var entities = await _context.Admins.ToListAsync();
            
        var dtos = entities.Select(e => new AdminDto
        {
            AdminId = e.AdminId,
            UserId = e.UserId,
            Department = e.Department,
            CreatedAt = e.CreatedAt,
        });

        return Ok(ApiResponse<IEnumerable<AdminDto>>.SuccessResponse(dtos, "Admin retrieved successfully"));
    }

    // GET: api/Admins/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<AdminDto>>> GetAdmin(int id)
    {
        var entity = await _context.Admins.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<AdminDto>.ErrorResponse("Admin not found"));

        var dto = new AdminDto
        {
            AdminId = entity.AdminId,
            UserId = entity.UserId,
            Department = entity.Department,
            CreatedAt = entity.CreatedAt,
        };

        return Ok(ApiResponse<AdminDto>.SuccessResponse(dto, "Admin retrieved successfully"));
    }

    // POST: api/Admins
    [HttpPost]
    public async Task<ActionResult<ApiResponse<AdminDto>>> PostAdmin(CreateAdminDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new Admin
        {
            UserId = createDto.UserId,
            Department = createDto.Department,
            CreatedAt = System.DateTime.UtcNow,
        };
        
        _context.Admins.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new AdminDto
        {
            AdminId = entity.AdminId,
            UserId = entity.UserId,
            Department = entity.Department,
            CreatedAt = entity.CreatedAt,
        };
        
        return CreatedAtAction(nameof(GetAdmin), new { id = entity.AdminId }, ApiResponse<AdminDto>.SuccessResponse(returnDto, "Admin created successfully"));
    }

    // PUT: api/Admins/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutAdmin(int id, UpdateAdminDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Admins.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Admin not found"));

        entity.Department = updateDto.Department;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Admin updated successfully"));
    }

    // DELETE: api/Admins/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteAdmin(int id)
    {
        var entity = await _context.Admins.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Admin not found"));

        _context.Admins.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Admin deleted successfully"));
    }
}
