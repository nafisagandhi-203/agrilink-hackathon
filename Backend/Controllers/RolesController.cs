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
public class RolesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateRoleDto> _createValidator;
    private readonly IValidator<UpdateRoleDto> _updateValidator;

public RolesController(ApplicationDbContext context, IValidator<CreateRoleDto> createValidator, IValidator<UpdateRoleDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Roles
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<RoleDto>>>> GetRoles()
    {
        var entities = await _context.Roles.ToListAsync();
            
        var dtos = entities.Select(e => new RoleDto
        {
            RoleId = e.RoleId,
            Name = e.Name,
        });

        return Ok(ApiResponse<IEnumerable<RoleDto>>.SuccessResponse(dtos, "Role retrieved successfully"));
    }

    // GET: api/Roles/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<RoleDto>>> GetRole(int id)
    {
        var entity = await _context.Roles.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<RoleDto>.ErrorResponse("Role not found"));

        var dto = new RoleDto
        {
            RoleId = entity.RoleId,
            Name = entity.Name,
        };

        return Ok(ApiResponse<RoleDto>.SuccessResponse(dto, "Role retrieved successfully"));
    }

    // POST: api/Roles
    [HttpPost]
    public async Task<ActionResult<ApiResponse<RoleDto>>> PostRole(CreateRoleDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new Role
        {
            Name = createDto.Name,
        };
        
        _context.Roles.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new RoleDto
        {
            RoleId = entity.RoleId,
            Name = entity.Name,
        };
        
        return CreatedAtAction(nameof(GetRole), new { id = entity.RoleId }, ApiResponse<RoleDto>.SuccessResponse(returnDto, "Role created successfully"));
    }

    // PUT: api/Roles/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutRole(int id, UpdateRoleDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Roles.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Role not found"));

        entity.Name = updateDto.Name;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Role updated successfully"));
    }

    // DELETE: api/Roles/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteRole(int id)
    {
        var entity = await _context.Roles.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Role not found"));

        _context.Roles.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Role deleted successfully"));
    }
}
