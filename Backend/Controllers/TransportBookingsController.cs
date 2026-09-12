using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using Models.Enums;
using DTOs;

namespace Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransportBookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TransportBookingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/TransportBookings
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TransportBookingDto>>>> GetTransportBookings(
        [FromQuery] int? transactionId = null,
        [FromQuery] string? status = null)
    {
        var query = _context.TransportBookings
            .Include(tb => tb.TransportProvider)
            .AsQueryable();

        if (transactionId.HasValue)
        {
            query = query.Where(tb => tb.TransactionId == transactionId.Value);
        }

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<TransportBookingStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(tb => tb.BookingStatus == parsedStatus);
        }

        var entities = await query.ToListAsync();

        var dtos = entities.Select(e => new TransportBookingDto
        {
            TransportBookingId = e.TransportBookingId,
            TransactionId = e.TransactionId,
            TransportProviderId = e.TransportProviderId,
            TransportProviderName = e.TransportProvider?.Name ?? string.Empty,
            VehicleType = e.TransportProvider?.VehicleType ?? string.Empty,
            VehicleNumber = e.TransportProvider?.VehicleNumber ?? string.Empty,
            PickupLocation = e.PickupLocation,
            PickupLatitude = e.PickupLatitude,
            PickupLongitude = e.PickupLongitude,
            DeliveryLocation = e.DeliveryLocation,
            DeliveryLatitude = e.DeliveryLatitude,
            DeliveryLongitude = e.DeliveryLongitude,
            CropQuantity = e.CropQuantity,
            DistanceKm = e.DistanceKm,
            EstimatedTravelTimeMinutes = e.EstimatedTravelTimeMinutes,
            EstimatedTransportCost = e.EstimatedTransportCost,
            AgreedTransportCost = e.AgreedTransportCost,
            BookingStatus = e.BookingStatus.ToString(),
            RequestedAt = e.RequestedAt,
            ConfirmedAt = e.ConfirmedAt,
            PickupAt = e.PickupAt,
            DeliveredAt = e.DeliveredAt
        });

        return Ok(ApiResponse<IEnumerable<TransportBookingDto>>.SuccessResponse(dtos, "Transport bookings retrieved successfully"));
    }

    // GET: api/TransportBookings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TransportBookingDto>>> GetTransportBooking(int id)
    {
        var e = await _context.TransportBookings
            .Include(tb => tb.TransportProvider)
            .FirstOrDefaultAsync(tb => tb.TransportBookingId == id);

        if (e == null)
            return NotFound(ApiResponse<TransportBookingDto>.ErrorResponse("Transport booking not found"));

        var dto = new TransportBookingDto
        {
            TransportBookingId = e.TransportBookingId,
            TransactionId = e.TransactionId,
            TransportProviderId = e.TransportProviderId,
            TransportProviderName = e.TransportProvider?.Name ?? string.Empty,
            VehicleType = e.TransportProvider?.VehicleType ?? string.Empty,
            VehicleNumber = e.TransportProvider?.VehicleNumber ?? string.Empty,
            PickupLocation = e.PickupLocation,
            PickupLatitude = e.PickupLatitude,
            PickupLongitude = e.PickupLongitude,
            DeliveryLocation = e.DeliveryLocation,
            DeliveryLatitude = e.DeliveryLatitude,
            DeliveryLongitude = e.DeliveryLongitude,
            CropQuantity = e.CropQuantity,
            DistanceKm = e.DistanceKm,
            EstimatedTravelTimeMinutes = e.EstimatedTravelTimeMinutes,
            EstimatedTransportCost = e.EstimatedTransportCost,
            AgreedTransportCost = e.AgreedTransportCost,
            BookingStatus = e.BookingStatus.ToString(),
            RequestedAt = e.RequestedAt,
            ConfirmedAt = e.ConfirmedAt,
            PickupAt = e.PickupAt,
            DeliveredAt = e.DeliveredAt
        };

        return Ok(ApiResponse<TransportBookingDto>.SuccessResponse(dto, "Transport booking retrieved successfully"));
    }

    // POST: api/TransportBookings
    [HttpPost]
    public async Task<ActionResult<ApiResponse<TransportBookingDto>>> CreateTransportBooking([FromBody] CreateTransportBookingDto request)
    {
        var booking = new TransportBooking
        {
            TransactionId = request.TransactionId,
            TransportProviderId = request.TransportProviderId,
            PickupLocation = request.PickupLocation,
            PickupLatitude = request.PickupLatitude,
            PickupLongitude = request.PickupLongitude,
            DeliveryLocation = request.DeliveryLocation,
            DeliveryLatitude = request.DeliveryLatitude,
            DeliveryLongitude = request.DeliveryLongitude,
            CropQuantity = request.CropQuantity,
            DistanceKm = request.DistanceKm,
            EstimatedTravelTimeMinutes = request.EstimatedTravelTimeMinutes,
            EstimatedTransportCost = request.EstimatedTransportCost,
            AgreedTransportCost = request.AgreedTransportCost,
            BookingStatus = TransportBookingStatus.Requested,
            RequestedAt = DateTime.UtcNow
        };

        _context.TransportBookings.Add(booking);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransportBooking), new { id = booking.TransportBookingId },
            ApiResponse<TransportBookingDto>.SuccessResponse(new TransportBookingDto
            {
                TransportBookingId = booking.TransportBookingId,
                TransactionId = booking.TransactionId,
                TransportProviderId = booking.TransportProviderId,
                PickupLocation = booking.PickupLocation,
                DeliveryLocation = booking.DeliveryLocation,
                CropQuantity = booking.CropQuantity,
                DistanceKm = booking.DistanceKm,
                EstimatedTransportCost = booking.EstimatedTransportCost,
                AgreedTransportCost = booking.AgreedTransportCost,
                BookingStatus = booking.BookingStatus.ToString(),
                RequestedAt = booking.RequestedAt
            }, "Transport booking created successfully"));
    }

    // PUT: api/TransportBookings/5/status
    [HttpPut("{id}/status")]
    public async Task<ActionResult<ApiResponse<TransportBookingDto>>> UpdateTransportBookingStatus(int id, [FromBody] UpdateTransportBookingStatusDto request)
    {
        var booking = await _context.TransportBookings.FindAsync(id);
        if (booking == null)
            return NotFound(ApiResponse<TransportBookingDto>.ErrorResponse("Transport booking not found"));

        if (!Enum.TryParse<TransportBookingStatus>(request.BookingStatus, true, out var newStatus))
            return BadRequest(ApiResponse<TransportBookingDto>.ErrorResponse("Invalid booking status"));

        booking.BookingStatus = newStatus;
        if (newStatus == TransportBookingStatus.Confirmed) booking.ConfirmedAt = DateTime.UtcNow;
        if (newStatus == TransportBookingStatus.PickedUp) booking.PickupAt = DateTime.UtcNow;
        if (newStatus == TransportBookingStatus.Delivered) booking.DeliveredAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<TransportBookingDto>.SuccessResponse(new TransportBookingDto
        {
            TransportBookingId = booking.TransportBookingId,
            TransactionId = booking.TransactionId,
            TransportProviderId = booking.TransportProviderId,
            BookingStatus = booking.BookingStatus.ToString()
        }, "Transport booking status updated successfully"));
    }
}
