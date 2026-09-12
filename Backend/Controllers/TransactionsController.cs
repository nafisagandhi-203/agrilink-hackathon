using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Data;
using HackathonProject.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace HackathonProject.Controllers
{
    [Authorize(Roles = "Farmer,Buyer")]
[ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionsController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetTransactions()
        {
            var trans = await _context.Transactions
                .Include(t => t.Farmer).ThenInclude(f => f.User)
                .Include(t => t.Buyer)
                .Include(t => t.Crop)
                .ToListAsync();

            return Ok(trans.Select(t => new TransactionResponseDto
            {
                TransactionId = t.TransactionId,
                CropListingId = t.CropListingId,
                FarmerId = t.FarmerId,
                FarmerName = t.Farmer?.User?.FullName ?? t.Farmer?.FarmName ?? string.Empty,
                BuyerId = t.BuyerId,
                BuyerName = t.Buyer?.BusinessName ?? string.Empty,
                OfferId = t.OfferId,
                CropId = t.CropId,
                CropName = t.Crop?.CropName ?? string.Empty,
                Quantity = t.Quantity,
                AgreedPrice = t.AgreedPrice,
                TotalAmount = t.TotalAmount,
                DeliveryDate = t.DeliveryDate,
                TransactionStatus = t.TransactionStatus.ToString(),
                CreatedAt = t.CreatedAt,
                CompletedAt = t.CompletedAt
            }).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionResponseDto>> GetTransaction(int id)
        {
            var t = await _context.Transactions
                .Include(x => x.Farmer).ThenInclude(f => f.User)
                .Include(x => x.Buyer)
                .Include(x => x.Crop)
                .FirstOrDefaultAsync(x => x.TransactionId == id);

            if (t == null) return NotFound();

            return Ok(new TransactionResponseDto
            {
                TransactionId = t.TransactionId,
                CropListingId = t.CropListingId,
                FarmerId = t.FarmerId,
                FarmerName = t.Farmer?.User?.FullName ?? t.Farmer?.FarmName ?? string.Empty,
                BuyerId = t.BuyerId,
                BuyerName = t.Buyer?.BusinessName ?? string.Empty,
                OfferId = t.OfferId,
                CropId = t.CropId,
                CropName = t.Crop?.CropName ?? string.Empty,
                Quantity = t.Quantity,
                AgreedPrice = t.AgreedPrice,
                TotalAmount = t.TotalAmount,
                DeliveryDate = t.DeliveryDate,
                TransactionStatus = t.TransactionStatus.ToString(),
                CreatedAt = t.CreatedAt,
                CompletedAt = t.CompletedAt
            });
        }

        [HttpPost]
        public async Task<ActionResult> PostTransaction(TransactionCreateDto dto)
        {
            var transaction = new Transaction
            {
                CropListingId = dto.CropListingId,
                FarmerId = dto.FarmerId,
                BuyerId = dto.BuyerId,
                OfferId = dto.OfferId,
                CropId = dto.CropId,
                Quantity = dto.Quantity,
                AgreedPrice = dto.AgreedPrice,
                TotalAmount = dto.TotalAmount,
                DeliveryDate = dto.DeliveryDate,
                TransactionStatus = Models.Enums.TransactionStatus.Confirmed,
                CreatedAt = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.TransactionId }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, TransactionUpdateDto dto)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return NotFound();

            transaction.Quantity = dto.Quantity;
            transaction.AgreedPrice = dto.AgreedPrice;
            transaction.TotalAmount = dto.TotalAmount;
            transaction.DeliveryDate = dto.DeliveryDate;
            transaction.TransactionStatus = dto.TransactionStatus;
            transaction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return NotFound();

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}


