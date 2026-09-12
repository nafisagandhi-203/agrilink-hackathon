using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using DTOs;

namespace Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransportProvidersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TransportProvidersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/TransportProviders
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TransportProviderDto>>>> GetTransportProviders(
        [FromQuery] string? serviceArea = null,
        [FromQuery] bool? onlyAvailable = null)
    {
        var query = _context.TransportProviders.AsQueryable();

        if (!string.IsNullOrEmpty(serviceArea))
        {
            query = query.Where(tp => tp.ServiceArea.Contains(serviceArea));
        }

        if (onlyAvailable.HasValue && onlyAvailable.Value)
        {
            query = query.Where(tp => tp.IsAvailable);
        }

        var entities = await query.ToListAsync();

        var dtos = entities.Select(e => new TransportProviderDto
        {
            TransportProviderId = e.TransportProviderId,
            Name = e.Name,
            PhoneNumber = e.PhoneNumber,
            VehicleType = e.VehicleType,
            VehicleNumber = e.VehicleNumber,
            VehicleCapacity = e.VehicleCapacity,
            ServiceArea = e.ServiceArea,
            Rating = e.Rating,
            IsAvailable = e.IsAvailable
        });

        return Ok(ApiResponse<IEnumerable<TransportProviderDto>>.SuccessResponse(dtos, "Transport providers retrieved successfully"));
    }

    // GET: api/TransportProviders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TransportProviderDto>>> GetTransportProvider(int id)
    {
        var e = await _context.TransportProviders.FindAsync(id);
        if (e == null)
            return NotFound(ApiResponse<TransportProviderDto>.ErrorResponse("Transport provider not found"));

        var dto = new TransportProviderDto
        {
            TransportProviderId = e.TransportProviderId,
            Name = e.Name,
            PhoneNumber = e.PhoneNumber,
            VehicleType = e.VehicleType,
            VehicleNumber = e.VehicleNumber,
            VehicleCapacity = e.VehicleCapacity,
            ServiceArea = e.ServiceArea,
            Rating = e.Rating,
            IsAvailable = e.IsAvailable
        };

        return Ok(ApiResponse<TransportProviderDto>.SuccessResponse(dto, "Transport provider retrieved successfully"));
    }

    // POST: api/TransportProviders
    [HttpPost]
    public async Task<ActionResult<ApiResponse<TransportProviderDto>>> CreateTransportProvider([FromBody] TransportProviderDto request)
    {
        var provider = new TransportProvider
        {
            Name = request.Name,
            PhoneNumber = request.PhoneNumber,
            VehicleType = request.VehicleType,
            VehicleNumber = request.VehicleNumber,
            VehicleCapacity = request.VehicleCapacity,
            ServiceArea = request.ServiceArea,
            Rating = request.Rating > 0 ? request.Rating : 4.5m,
            IsAvailable = request.IsAvailable,
            CreatedAt = DateTime.UtcNow
        };

        _context.TransportProviders.Add(provider);
        await _context.SaveChangesAsync();

        request.TransportProviderId = provider.TransportProviderId;
        return CreatedAtAction(nameof(GetTransportProvider), new { id = provider.TransportProviderId },
            ApiResponse<TransportProviderDto>.SuccessResponse(request, "Transport provider created successfully"));
    }
}
