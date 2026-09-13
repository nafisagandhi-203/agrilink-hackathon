using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using FluentValidation;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using DTOs;

namespace Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class BuyerRequirementsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

    

        private readonly IValidator<CreateBuyerRequirementDto> _createValidator;
    private readonly IValidator<UpdateBuyerRequirementDto> _updateValidator;

public BuyerRequirementsController(ApplicationDbContext context, IValidator<CreateBuyerRequirementDto> createValidator, IValidator<UpdateBuyerRequirementDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/BuyerRequirements
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BuyerRequirementDto>>> GetBuyerRequirements()
    {
        var entities = await _context.BuyerRequirements
            .Include(b => b.Crop)
            .Include(b => b.Buyer)
                .ThenInclude(b => b.User)
            .ToListAsync();
            
        return Ok(entities.Select(e => new BuyerRequirementDto
        {
            BuyerRequirementId = e.BuyerRequirementId,
            BuyerId = e.BuyerId,
            BuyerName = e.Buyer?.BusinessName ?? e.Buyer?.User?.FullName ?? string.Empty,
            CropId = e.CropId,
            CropName = e.Crop?.CropName ?? string.Empty,
            RequiredQuantity = e.RequiredQuantity,
            QualityGrade = e.QualityGrade,
            Location = e.Location,
            OfferedPrice = e.OfferedPrice,
            PurchaseDate = e.PurchaseDate,
            Status = e.Status.ToString()
        }));
    }

    // GET: api/BuyerRequirements/5
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<BuyerRequirementDto>> GetBuyerRequirement(int id)
    {
        var entity = await _context.BuyerRequirements
            .Include(b => b.Crop)
            .Include(b => b.Buyer)
                .ThenInclude(b => b.User)
            .FirstOrDefaultAsync(e => e.BuyerRequirementId == id);

        if (entity == null) return NotFound();

        return new BuyerRequirementDto
        {
            BuyerRequirementId = entity.BuyerRequirementId,
            BuyerId = entity.BuyerId,
            BuyerName = entity.Buyer?.BusinessName ?? entity.Buyer?.User?.FullName ?? string.Empty,
            CropId = entity.CropId,
            CropName = entity.Crop?.CropName ?? string.Empty,
            RequiredQuantity = entity.RequiredQuantity,
            QualityGrade = entity.QualityGrade,
            Location = entity.Location,
            OfferedPrice = entity.OfferedPrice,
            PurchaseDate = entity.PurchaseDate,
            Status = entity.Status.ToString()
        };
    }

    // POST: api/BuyerRequirements
    [Authorize(Roles = "Buyer")]
    [HttpPost]
    public async Task<ActionResult<BuyerRequirementDto>> PostBuyerRequirement(CreateBuyerRequirementDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new BuyerRequirement
        {
            BuyerId = createDto.BuyerId,
            CropId = createDto.CropId,
            RequiredQuantity = createDto.RequiredQuantity,
            MinQuantity = createDto.MinQuantity,
            MaxQuantity = createDto.MaxQuantity,
            QualityGrade = createDto.QualityGrade,
            Location = createDto.Location,
            District = createDto.District,
            State = createDto.State,
            OfferedPrice = createDto.OfferedPrice,
            PurchaseDate = createDto.PurchaseDate,
            Status = "Open",
            CreatedAt = System.DateTime.UtcNow
        };
        
        _context.BuyerRequirements.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new BuyerRequirementDto
        {
            BuyerRequirementId = entity.BuyerRequirementId,
            BuyerId = entity.BuyerId,
            BuyerName = string.Empty,
            CropId = entity.CropId,
            CropName = string.Empty,
            RequiredQuantity = entity.RequiredQuantity,
            QualityGrade = entity.QualityGrade,
            Location = entity.Location,
            OfferedPrice = entity.OfferedPrice,
            PurchaseDate = entity.PurchaseDate,
            Status = entity.Status.ToString()
        };
        return CreatedAtAction(nameof(GetBuyerRequirement), new { id = entity.BuyerRequirementId }, returnDto);
    }

    // PUT: api/BuyerRequirements/5
    [Authorize(Roles = "Buyer")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutBuyerRequirement(int id, UpdateBuyerRequirementDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.BuyerRequirements.FindAsync(id);
        if (entity == null) return NotFound();

        entity.RequiredQuantity = updateDto.RequiredQuantity;
        entity.OfferedPrice = updateDto.OfferedPrice;
        if (!string.IsNullOrEmpty(updateDto.Status)) {
            entity.Status = updateDto.Status;
        }
        entity.UpdatedAt = System.DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/BuyerRequirements/5
    [Authorize(Roles = "Buyer")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBuyerRequirement(int id)
    {
        var entity = await _context.BuyerRequirements.FindAsync(id);
        if (entity == null) return NotFound();

        _context.BuyerRequirements.Remove(entity);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}



