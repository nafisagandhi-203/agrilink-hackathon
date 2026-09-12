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
public class TransactionReceiptsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    

        private readonly IValidator<CreateTransactionReceiptDto> _createValidator;
    private readonly IValidator<UpdateTransactionReceiptDto> _updateValidator;

public TransactionReceiptsController(ApplicationDbContext context, IValidator<CreateTransactionReceiptDto> createValidator, IValidator<UpdateTransactionReceiptDto> updateValidator)
    {
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _context = context;
    }

    // GET: api/TransactionReceipts
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TransactionReceiptDto>>>> GetTransactionReceipts()
    {
        var entities = await _context.TransactionReceipts.ToListAsync();
            
        var dtos = entities.Select(e => new TransactionReceiptDto
        {
            TransactionReceiptId = e.TransactionReceiptId,
            TransactionId = e.TransactionId,
            ReceiptNumber = e.ReceiptNumber,
            GeneratedAt = e.GeneratedAt,
            TotalAmount = e.TotalAmount,
        });

        return Ok(ApiResponse<IEnumerable<TransactionReceiptDto>>.SuccessResponse(dtos, "TransactionReceipt retrieved successfully"));
    }

    // GET: api/TransactionReceipts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TransactionReceiptDto>>> GetTransactionReceipt(int id)
    {
        var entity = await _context.TransactionReceipts.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<TransactionReceiptDto>.ErrorResponse("TransactionReceipt not found"));

        var dto = new TransactionReceiptDto
        {
            TransactionReceiptId = entity.TransactionReceiptId,
            TransactionId = entity.TransactionId,
            ReceiptNumber = entity.ReceiptNumber,
            GeneratedAt = entity.GeneratedAt,
            TotalAmount = entity.TotalAmount,
        };

        return Ok(ApiResponse<TransactionReceiptDto>.SuccessResponse(dto, "TransactionReceipt retrieved successfully"));
    }

    // POST: api/TransactionReceipts
    [HttpPost]
    public async Task<ActionResult<ApiResponse<TransactionReceiptDto>>> PostTransactionReceipt(CreateTransactionReceiptDto createDto)
    {
        var createValidationResult = await _createValidator.ValidateAsync(createDto);
        if (!createValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", createValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = new TransactionReceipt
        {
            TransactionId = createDto.TransactionId,
            ReceiptNumber = createDto.ReceiptNumber,
            TotalAmount = createDto.TotalAmount,
            GeneratedAt = System.DateTime.UtcNow,
        };
        
        _context.TransactionReceipts.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new TransactionReceiptDto
        {
            TransactionReceiptId = entity.TransactionReceiptId,
            TransactionId = entity.TransactionId,
            ReceiptNumber = entity.ReceiptNumber,
            GeneratedAt = entity.GeneratedAt,
            TotalAmount = entity.TotalAmount,
        };
        
        return CreatedAtAction(nameof(GetTransactionReceipt), new { id = entity.TransactionReceiptId }, ApiResponse<TransactionReceiptDto>.SuccessResponse(returnDto, "TransactionReceipt created successfully"));
    }

    // PUT: api/TransactionReceipts/5
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> PutTransactionReceipt(int id, UpdateTransactionReceiptDto updateDto)
    {
        var updateValidationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!updateValidationResult.IsValid)
        {
            return BadRequest(DTOs.ApiResponse<object>.ErrorResponse("Validation failed", updateValidationResult.Errors.Select(e => e.ErrorMessage).ToList()));
        }

        var entity = await _context.TransactionReceipts.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("TransactionReceipt not found"));

        entity.ReceiptNumber = updateDto.ReceiptNumber;
        entity.TotalAmount = updateDto.TotalAmount;
        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "TransactionReceipt updated successfully"));
    }

    // DELETE: api/TransactionReceipts/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteTransactionReceipt(int id)
    {
        var entity = await _context.TransactionReceipts.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("TransactionReceipt not found"));

        _context.TransactionReceipts.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "TransactionReceipt deleted successfully"));
    }
}


