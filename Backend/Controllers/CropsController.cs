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
public class CropsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateCropDto> _createValidator;
    private readonly IValidator<UpdateCropDto> _updateValidator;

public CropsController(ApplicationDbContext context, IValidator<CreateCropDto> createValidator, IValidator<UpdateCropDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Crops
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CropDto>>>> GetCrops()
    {
        var entities = await _context.Crops.ToListAsync();
            
        var dtos = entities.Select(e => new CropDto
        {
            CropId = e.CropId,
            CropName = e.CropName,
            CommodityGroup = e.CommodityGroup,
            Description = e.Description,
            IsActive = e.IsActive,
        });

        return Ok(ApiResponse<IEnumerable<CropDto>>.SuccessResponse(dtos, "Crop retrieved successfully"));
    }

    // GET: api/Crops/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CropDto>>> GetCrop(int id)
    {
        var entity = await _context.Crops.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<CropDto>.ErrorResponse("Crop not found"));

        var dto = new CropDto
        {
            CropId = entity.CropId,
            CropName = entity.CropName,
            CommodityGroup = entity.CommodityGroup,
            Description = entity.Description,
            IsActive = entity.IsActive,
        };

        return Ok(ApiResponse<CropDto>.SuccessResponse(dto, "Crop retrieved successfully"));
    }

    // POST: api/Crops
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CropDto>>> PostCrop(CreateCropDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new Crop
        {
            CropName = createDto.CropName,
            CommodityGroup = createDto.CommodityGroup,
            Description = createDto.Description,
            IsActive = createDto.IsActive,
        };
        
        _context.Crops.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new CropDto
        {
            CropId = entity.CropId,
            CropName = entity.CropName,
            CommodityGroup = entity.CommodityGroup,
            Description = entity.Description,
            IsActive = entity.IsActive,
        };
        
        return CreatedAtAction(nameof(GetCrop), new { id = entity.CropId }, ApiResponse<CropDto>.SuccessResponse(returnDto, "Crop created successfully"));
    }

    // PUT: api/Crops/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutCrop(int id, UpdateCropDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Crops.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Crop not found"));

        entity.CropName = updateDto.CropName;
        entity.CommodityGroup = updateDto.CommodityGroup;
        entity.Description = updateDto.Description;
        entity.IsActive = updateDto.IsActive;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Crop updated successfully"));
    }

    // DELETE: api/Crops/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCrop(int id)
    {
        var entity = await _context.Crops.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Crop not found"));

        _context.Crops.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Crop deleted successfully"));
    }
}



