using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using Models.Enums;
using DTOs;
using Services;

namespace Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Farmer,Buyer,Admin")]
public class TransportBookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITransportService _transportService;

    public TransportBookingsController(ApplicationDbContext context, ITransportService transportService)
    {
        _context = context;
        _transportService = transportService;
    }

    private int? CurrentUserId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : (int?)null;

    private async Task<int?> GetFarmerIdAsync(int userId) =>
        (await _context.Farmers.FirstOrDefaultAsync(f => f.UserId == userId))?.FarmerId;

    private async Task<int?> GetBuyerIdAsync(int userId) =>
        (await _context.Buyers.FirstOrDefaultAsync(b => b.UserId == userId))?.BuyerId;

    private IQueryable<TransportBooking> BookingQuery() => _context.TransportBookings
        .Include(tb => tb.TransportProvider)
        .Include(tb => tb.Transaction)
            .ThenInclude(t => t.Farmer).ThenInclude(f => f.User)
        .Include(tb => tb.Transaction)
            .ThenInclude(t => t.Buyer);

    private static TransportBookingDto ToDto(TransportBooking e) => new TransportBookingDto
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
        DistanceNote = e.DistanceNote,
        EstimatedFare = e.EstimatedFare,
        EstimatedTravelTimeMinutes = e.EstimatedTravelTimeMinutes,
        EstimatedTransportCost = e.EstimatedTransportCost,
        AgreedTransportCost = e.AgreedTransportCost,
        BookingStatus = e.BookingStatus.ToString(),
        RequestedAt = e.RequestedAt,
        ConfirmedAt = e.ConfirmedAt,
        PickupAt = e.PickupAt,
        DeliveredAt = e.DeliveredAt
    };

    // GET: api/TransportBookings (scoped to the transaction parties or the admin)
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TransportBookingDto>>>> GetTransportBookings(
        [FromQuery] int? transactionId = null,
        [FromQuery] string? status = null)
    {
        var userId = CurrentUserId;
        if (userId == null) return Unauthorized();

        var query = BookingQuery();

        if (!User.IsInRole("Admin"))
        {
            var farmerId = await GetFarmerIdAsync(userId.Value);
            var buyerId = await GetBuyerIdAsync(userId.Value);
            query = query.Where(tb =>
                (farmerId.HasValue && tb.Transaction.FarmerId == farmerId.Value)
                || (buyerId.HasValue && tb.Transaction.BuyerId == buyerId.Value));
        }

        if (transactionId.HasValue)
            query = query.Where(tb => tb.TransactionId == transactionId.Value);

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<TransportBookingStatus>(status, true, out var parsedStatus))
            query = query.Where(tb => tb.BookingStatus == parsedStatus);

        var entities = await query.OrderByDescending(tb => tb.RequestedAt).ToListAsync();
        return Ok(ApiResponse<IEnumerable<TransportBookingDto>>.SuccessResponse(entities.Select(ToDto), "Transport bookings retrieved successfully"));
    }

    // GET: api/TransportBookings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TransportBookingDto>>> GetTransportBooking(int id)
    {
        var userId = CurrentUserId;
        if (userId == null) return Unauthorized();

        var booking = await BookingQuery().FirstOrDefaultAsync(tb => tb.TransportBookingId == id);
        if (booking == null)
            return NotFound(ApiResponse<TransportBookingDto>.ErrorResponse("Transport booking not found"));

        if (!await CanAccessAsync(userId.Value, booking)) return Forbid();

        return Ok(ApiResponse<TransportBookingDto>.SuccessResponse(ToDto(booking), "Transport booking retrieved successfully"));
    }

    // POST: api/TransportBookings (only a party to the linked transaction may book transport)
    [HttpPost]
    [Authorize(Roles = "Farmer,Buyer")]
    public async Task<ActionResult<ApiResponse<TransportBookingDto>>> CreateTransportBooking([FromBody] CreateTransportBookingDto request)
    {
        var userId = CurrentUserId;
        if (userId == null) return Unauthorized();

        var transaction = await _context.Transactions.FindAsync(request.TransactionId);
        if (transaction == null)
            return NotFound(ApiResponse<TransportBookingDto>.ErrorResponse("Transaction not found"));

        if (!await IsParticipantAsync(userId.Value, transaction)) return Forbid();

        var (booking, error) = await _transportService.CreateBookingAsync(request);
        if (error != null)
            return BadRequest(ApiResponse<TransportBookingDto>.ErrorResponse(error));

        return CreatedAtAction(nameof(GetTransportBooking), new { id = booking!.TransportBookingId },
            ApiResponse<TransportBookingDto>.SuccessResponse(ToDto(booking), "Transport booking created successfully"));
    }

    // PUT: api/TransportBookings/5/status
    [HttpPut("{id}/status")]
    public async Task<ActionResult<ApiResponse<TransportBookingDto>>> UpdateTransportBookingStatus(int id, [FromBody] UpdateTransportBookingStatusDto request)
    {
        var userId = CurrentUserId;
        if (userId == null) return Unauthorized();

        var booking = await BookingQuery().FirstOrDefaultAsync(tb => tb.TransportBookingId == id);
        if (booking == null)
            return NotFound(ApiResponse<TransportBookingDto>.ErrorResponse("Transport booking not found"));

        if (!await CanAccessAsync(userId.Value, booking)) return Forbid();

        var normalized = Regex.Replace(request.BookingStatus ?? string.Empty, @"[\s_-]+", string.Empty);
        if (!Enum.TryParse<TransportBookingStatus>(normalized, true, out var newStatus))
            return BadRequest(ApiResponse<TransportBookingDto>.ErrorResponse("Invalid booking status"));

        var (ok, statusError) = await _transportService.UpdateStatusAsync(booking, newStatus);
        if (!ok)
            return BadRequest(ApiResponse<TransportBookingDto>.ErrorResponse(statusError ?? "Invalid status transition"));

        return Ok(ApiResponse<TransportBookingDto>.SuccessResponse(ToDto(booking), "Transport booking status updated successfully"));
    }

    private async Task<bool> IsParticipantAsync(int userId, Transaction transaction)
    {
        var farmerId = await GetFarmerIdAsync(userId);
        var buyerId = await GetBuyerIdAsync(userId);
        return (farmerId.HasValue && transaction.FarmerId == farmerId.Value)
            || (buyerId.HasValue && transaction.BuyerId == buyerId.Value);
    }

    private async Task<bool> CanAccessAsync(int userId, TransportBooking booking)
    {
        if (User.IsInRole("Admin")) return true;
        return await IsParticipantAsync(userId, booking.Transaction);
    }
}