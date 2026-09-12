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
public class BuyersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    private readonly IValidator<CreateBuyerDto> _createValidator;
    private readonly IValidator<UpdateBuyerDto> _updateValidator;

    public BuyersController(ApplicationDbContext context, IValidator<CreateBuyerDto> createValidator, IValidator<UpdateBuyerDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/Buyers
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ApiResponse<IEnumerable<BuyerDto>>>> GetBuyers()
    {
        var entities = await _context.Buyers.ToListAsync();
            
        var dtos = entities.Select(e => new BuyerDto
        {
            BuyerId = e.BuyerId,
            UserId = e.UserId,
            BuyerType = e.BuyerType,
            BusinessName = e.BusinessName,
            State = e.State,
            District = e.District,
            Pincode = e.Pincode,
            PhoneNumber = e.PhoneNumber,
            PreferredCommodity = e.PreferredCommodity,
            CommodityGroup = e.CommodityGroup,
            MinQuantity = e.MinQuantity,
            MaxQuantity = e.MaxQuantity,
            AcceptedGrades = e.AcceptedGrades,
            MaxSourcingDistance = e.MaxSourcingDistance,
            Rating = e.Rating,
            TotalTransactions = e.TotalTransactions,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
        });

        return Ok(ApiResponse<IEnumerable<BuyerDto>>.SuccessResponse(dtos, "Buyer retrieved successfully"));
    }

    // GET: api/Buyers/5
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<BuyerDto>>> GetBuyer(int id)
    {
        var entity = await _context.Buyers.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<BuyerDto>.ErrorResponse("Buyer not found"));

        var dto = new BuyerDto
        {
            BuyerId = entity.BuyerId,
            UserId = entity.UserId,
            BuyerType = entity.BuyerType,
            BusinessName = entity.BusinessName,
            State = entity.State,
            District = entity.District,
            Pincode = entity.Pincode,
            PhoneNumber = entity.PhoneNumber,
            PreferredCommodity = entity.PreferredCommodity,
            CommodityGroup = entity.CommodityGroup,
            MinQuantity = entity.MinQuantity,
            MaxQuantity = entity.MaxQuantity,
            AcceptedGrades = entity.AcceptedGrades,
            MaxSourcingDistance = entity.MaxSourcingDistance,
            Rating = entity.Rating,
            TotalTransactions = entity.TotalTransactions,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
        };

        return Ok(ApiResponse<BuyerDto>.SuccessResponse(dto, "Buyer retrieved successfully"));
    }

    // POST: api/Buyers
    [HttpPost]
    [Authorize(Roles = "Buyer")]
    public async Task<ActionResult<ApiResponse<BuyerDto>>> PostBuyer(CreateBuyerDto createDto)
    {
        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId)) return Unauthorized();
        if (createDto.UserId != currentUserId) return Forbid();

        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new Buyer
        {
            UserId = createDto.UserId,
            BuyerType = createDto.BuyerType,
            BusinessName = createDto.BusinessName,
            State = createDto.State,
            District = createDto.District,
            Pincode = createDto.Pincode,
            PhoneNumber = createDto.PhoneNumber,
            PreferredCommodity = createDto.PreferredCommodity,
            CommodityGroup = createDto.CommodityGroup,
            MinQuantity = createDto.MinQuantity,
            MaxQuantity = createDto.MaxQuantity,
            AcceptedGrades = createDto.AcceptedGrades,
            MaxSourcingDistance = createDto.MaxSourcingDistance,
            Rating = createDto.Rating,
            TotalTransactions = createDto.TotalTransactions,
            CreatedAt = System.DateTime.UtcNow,
        };
        
        _context.Buyers.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new BuyerDto
        {
            BuyerId = entity.BuyerId,
            UserId = entity.UserId,
            BuyerType = entity.BuyerType,
            BusinessName = entity.BusinessName,
            State = entity.State,
            District = entity.District,
            Pincode = entity.Pincode,
            PhoneNumber = entity.PhoneNumber,
            PreferredCommodity = entity.PreferredCommodity,
            CommodityGroup = entity.CommodityGroup,
            MinQuantity = entity.MinQuantity,
            MaxQuantity = entity.MaxQuantity,
            AcceptedGrades = entity.AcceptedGrades,
            MaxSourcingDistance = entity.MaxSourcingDistance,
            Rating = entity.Rating,
            TotalTransactions = entity.TotalTransactions,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
        };
        
        return CreatedAtAction(nameof(GetBuyer), new { id = entity.BuyerId }, ApiResponse<BuyerDto>.SuccessResponse(returnDto, "Buyer created successfully"));
    }

    // PUT: api/Buyers/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Buyer")]
    public async Task<ActionResult<ApiResponse<object>>> PutBuyer(int id, UpdateBuyerDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.Buyers.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Buyer not found"));

        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId) || entity.UserId != currentUserId) return Forbid();

        entity.BuyerType = updateDto.BuyerType;
        entity.BusinessName = updateDto.BusinessName;
        entity.State = updateDto.State;
        entity.District = updateDto.District;
        entity.Pincode = updateDto.Pincode;
        entity.PhoneNumber = updateDto.PhoneNumber;
        entity.PreferredCommodity = updateDto.PreferredCommodity;
        entity.CommodityGroup = updateDto.CommodityGroup;
        entity.MinQuantity = updateDto.MinQuantity;
        entity.MaxQuantity = updateDto.MaxQuantity;
        entity.AcceptedGrades = updateDto.AcceptedGrades;
        entity.MaxSourcingDistance = updateDto.MaxSourcingDistance;
        entity.Rating = updateDto.Rating;
        entity.TotalTransactions = updateDto.TotalTransactions;
        entity.UpdatedAt = System.DateTime.UtcNow;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Buyer updated successfully"));
    }

    // DELETE: api/Buyers/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Buyer")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteBuyer(int id)
    {
        var entity = await _context.Buyers.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("Buyer not found"));

        var currentUserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(currentUserIdStr, out int currentUserId) || entity.UserId != currentUserId) return Forbid();

        _context.Buyers.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Buyer deleted successfully"));
    }
}
