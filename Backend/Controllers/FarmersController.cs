using System.Linq;
using FluentValidation;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Controllers;

[Route("api/[controller]")]
[ApiController]
public class FarmersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    private readonly IValidator<CreateFarmerDto> _createValidator;
    private readonly IValidator<UpdateFarmerDto> _updateValidator;

    public FarmersController(ApplicationDbContext context, IValidator<CreateFarmerDto> createValidator, IValidator<UpdateFarmerDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Farmers
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ApiResponse<IEnumerable<FarmerDto>>>> GetFarmers()
    {
        var entities = await _context.Farmers.ToListAsync();
            
        var dtos = entities.Select(e => new FarmerDto
        {
            FarmerId = e.FarmerId,
            UserId = e.UserId,
            FarmName = e.FarmName,
            FarmLocation = e.FarmLocation,
            District = e.District,
            State = e.State,
            Pincode = e.Pincode,
            FarmSize = e.FarmSize,
            CreatedAt = e.CreatedAt,
        });

        return Ok(ApiResponse<IEnumerable<FarmerDto>>.SuccessResponse(dtos, "Farmer retrieved successfully"));
    }

    // GET: api/Farmers/5
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<FarmerDto>>> GetFarmer(int id)
    {
        var entity = await _context.Farmers.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<FarmerDto>.ErrorResponse("Farmer not found"));

        var dto = new FarmerDto
        {
            FarmerId = entity.FarmerId,
            UserId = entity.UserId,
            FarmName = entity.FarmName,
            FarmLocation = entity.FarmLocation,
            District = entity.District,
            State = entity.State,
            Pincode = entity.Pincode,
            FarmSize = entity.FarmSize,
            CreatedAt = entity.CreatedAt,
        };

        return Ok(ApiResponse<FarmerDto>.SuccessResponse(dto, "Farmer retrieved successfully"));
    }

    // POST: api/Farmers
    [HttpPost]
    [Authorize(Roles = "Farmer")]
    public async Task<ActionResult<ApiResponse<FarmerDto>>> PostFarmer(CreateFarmerDto createDto)
    {
        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();
        if (createDto.UserId != currentUserId) return Forbid();

        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new Farmer
        {
            UserId = createDto.UserId,
            FarmName = createDto.FarmName,
            FarmLocation = createDto.FarmLocation,
            District = createDto.District,
            State = createDto.State,
            Pincode = createDto.Pincode,
            FarmSize = createDto.FarmSize,
            CreatedAt = System.DateTime.UtcNow,
        };
        
        _context.Farmers.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new FarmerDto
        {
            FarmerId = entity.FarmerId,
            UserId = entity.UserId,
            FarmName = entity.FarmName,
            FarmLocation = entity.FarmLocation,
            District = entity.District,
            State = entity.State,
            Pincode = entity.Pincode,
            FarmSize = entity.FarmSize,
            CreatedAt = entity.CreatedAt,
        };
        
        return CreatedAtAction(nameof(GetFarmer), new { id = entity.FarmerId }, ApiResponse<FarmerDto>.SuccessResponse(returnDto, "Farmer created successfully"));
    }

    // PUT: api/Farmers/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Farmer")]
    public async Task<ActionResult<ApiResponse<object>>> PutFarmer(int id, UpdateFarmerDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Farmers.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Farmer not found"));

        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId) || entity.UserId != currentUserId) return Forbid();

        entity.FarmName = updateDto.FarmName;
        entity.FarmLocation = updateDto.FarmLocation;
        entity.District = updateDto.District;
        entity.State = updateDto.State;
        entity.Pincode = updateDto.Pincode;
        entity.FarmSize = updateDto.FarmSize;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Farmer updated successfully"));
    }

    // DELETE: api/Farmers/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Farmer")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteFarmer(int id)
    {
        var entity = await _context.Farmers.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Farmer not found"));

        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId) || entity.UserId != currentUserId) return Forbid();

        _context.Farmers.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Farmer deleted successfully"));
    }
}
