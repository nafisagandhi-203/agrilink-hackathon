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
    [Authorize]
[ApiController]
    [Route("api/[controller]")]
    public class MarketPricesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MarketPricesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MarketPriceResponseDto>>> GetMarketPrices()
        {
            var prices = await _context.MarketPrices.Include(m => m.Crop).ToListAsync();

            return Ok(prices.Select(m => new MarketPriceResponseDto
            {
                MarketPriceId = m.MarketPriceId,
                CropId = m.CropId,
                CropName = m.Crop?.CropName ?? string.Empty,
                MarketName = m.MarketName,
                Location = m.Location,
                District = m.District,
                State = m.State,
                MinPrice = m.MinPrice,
                MaxPrice = m.MaxPrice,
                ModalPrice = m.ModalPrice,
                Unit = m.Unit,
                PriceDate = m.PriceDate,
                Source = m.Source,
                CreatedAt = m.CreatedAt
            }).ToList());
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<MarketPriceResponseDto>> GetMarketPrice(int id)
        {
            var m = await _context.MarketPrices.Include(x => x.Crop).FirstOrDefaultAsync(x => x.MarketPriceId == id);
            if (m == null) return NotFound();

            return Ok(new MarketPriceResponseDto
            {
                MarketPriceId = m.MarketPriceId,
                CropId = m.CropId,
                CropName = m.Crop?.CropName ?? string.Empty,
                MarketName = m.MarketName,
                Location = m.Location,
                District = m.District,
                State = m.State,
                MinPrice = m.MinPrice,
                MaxPrice = m.MaxPrice,
                ModalPrice = m.ModalPrice,
                Unit = m.Unit,
                PriceDate = m.PriceDate,
                Source = m.Source,
                CreatedAt = m.CreatedAt
            });
        }

        [Authorize(Roles = "Admin")]
    [HttpPost]
        public async Task<ActionResult> PostMarketPrice(MarketPriceCreateDto dto)
        {
            var mp = new MarketPrice
            {
                CropId = dto.CropId,
                MarketName = dto.MarketName,
                Location = dto.Location,
                District = dto.District,
                State = dto.State,
                MinPrice = dto.MinPrice,
                MaxPrice = dto.MaxPrice,
                ModalPrice = dto.ModalPrice,
                Unit = dto.Unit,
                PriceDate = dto.PriceDate,
                Source = dto.Source,
                CreatedAt = DateTime.UtcNow
            };

            _context.MarketPrices.Add(mp);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMarketPrice), new { id = mp.MarketPriceId }, null);
        }

        [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
        public async Task<IActionResult> PutMarketPrice(int id, MarketPriceUpdateDto dto)
        {
            var mp = await _context.MarketPrices.FindAsync(id);
            if (mp == null) return NotFound();

            mp.CropId = dto.CropId;
            mp.MarketName = dto.MarketName;
            mp.Location = dto.Location;
            mp.District = dto.District;
            mp.State = dto.State;
            mp.MinPrice = dto.MinPrice;
            mp.MaxPrice = dto.MaxPrice;
            mp.ModalPrice = dto.ModalPrice;
            mp.Unit = dto.Unit;
            mp.PriceDate = dto.PriceDate;
            mp.Source = dto.Source;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMarketPrice(int id)
        {
            var mp = await _context.MarketPrices.FindAsync(id);
            if (mp == null) return NotFound();

            _context.MarketPrices.Remove(mp);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}



