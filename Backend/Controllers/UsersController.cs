using FluentValidation;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using DTOs;

namespace Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

    

        private readonly IValidator<CreateUserDto> _createValidator;
    private readonly IValidator<UpdateUserDto> _updateValidator;

public UsersController(ApplicationDbContext context, IValidator<CreateUserDto> createValidator, IValidator<UpdateUserDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var entities = await _context.Users.ToListAsync();
            
        return Ok(entities.Select(e => new UserDto
        {
            UserId = e.UserId,
            FullName = e.FullName,
            Email = e.Email,
            PhoneNumber = e.PhoneNumber,
            RoleId = e.RoleId,
            IsVerified = e.IsVerified,
            IsActive = e.IsActive,
            CreatedAt = e.CreatedAt
        }));
    }

    // GET: api/Users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var entity = await _context.Users.FirstOrDefaultAsync(e => e.UserId == id);

        if (entity == null) return NotFound();

        return new UserDto
        {
            UserId = entity.UserId,
            FullName = entity.FullName,
            Email = entity.Email,
            PhoneNumber = entity.PhoneNumber,
            RoleId = entity.RoleId,
            IsVerified = entity.IsVerified,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt
        };
    }

    // POST: api/Users
    [HttpPost]
    public async Task<ActionResult<UserDto>> PostUser(CreateUserDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new User
        {
            FullName = createDto.FullName,
            Email = createDto.Email,
            PhoneNumber = createDto.PhoneNumber,
            PasswordHash = createDto.Password,
            RoleId = createDto.RoleId,
            IsActive = true,
            CreatedAt = System.DateTime.UtcNow
        };
        
        _context.Users.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new UserDto
        {
            UserId = entity.UserId,
            FullName = entity.FullName,
            Email = entity.Email,
            PhoneNumber = entity.PhoneNumber,
            RoleId = entity.RoleId,
            IsVerified = entity.IsVerified,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt
        };
        return CreatedAtAction(nameof(GetUser), new { id = entity.UserId }, returnDto);
    }

    // PUT: api/Users/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(int id, UpdateUserDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Users.FindAsync(id);
        if (entity == null) return NotFound();

        entity.FullName = updateDto.FullName;
        entity.PhoneNumber = updateDto.PhoneNumber;
        entity.IsActive = updateDto.IsActive;
        entity.UpdatedAt = System.DateTime.UtcNow;
        
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Users/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var entity = await _context.Users.FindAsync(id);
        if (entity == null) return NotFound();

        _context.Users.Remove(entity);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
