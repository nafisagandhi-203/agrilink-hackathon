using System;
using System.Threading.Tasks;
using Data;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Enums;

namespace Services;

public interface ITransportService
{
    Task<(TransportBooking? Booking, string? Error)> CreateBookingAsync(CreateTransportBookingDto request);
    Task<(bool Ok, string? Error)> UpdateStatusAsync(TransportBooking booking, TransportBookingStatus newStatus);
}

/// <summary>
/// Server-side transport logic: computes the physical distance (Haversine), an
/// estimated fare, travel time, validates the booking state machine and notifies
/// both transaction parties. Clients can never dictate these values.
/// </summary>
public class TransportService : ITransportService
{
    private const decimal BaseFareInr = 500m;
    private const decimal PerKmRateInr = 15m;
    private const decimal AvgSpeedKmh = 40m;

    private readonly ApplicationDbContext _context;
    private readonly ITransactionService _transactionService;

    public TransportService(ApplicationDbContext context, ITransactionService transactionService)
    {
        _context = context;
        _transactionService = transactionService;
    }

    public async Task<(TransportBooking? Booking, string? Error)> CreateBookingAsync(CreateTransportBookingDto request)
    {
        var provider = await _context.TransportProviders.FindAsync(request.TransportProviderId);
        if (provider == null) return (null, "Transport provider not found.");

        var transaction = await _context.Transactions
            .Include(t => t.Farmer).ThenInclude(f => f.User)
            .Include(t => t.Buyer)
            .FirstOrDefaultAsync(t => t.TransactionId == request.TransactionId);
        if (transaction == null) return (null, "Transaction not found.");

        var (distanceKm, note) = ComputeDistance(
            request.PickupLatitude, request.PickupLongitude,
            request.DeliveryLatitude, request.DeliveryLongitude);

        var fare = EstimateFare(distanceKm);
        var travelMinutes = Math.Max(0, (int)Math.Round(distanceKm / AvgSpeedKmh * 60m));

        var booking = new TransportBooking
        {
            TransactionId = transaction.TransactionId,
            TransportProviderId = provider.TransportProviderId,
            PickupLocation = request.PickupLocation,
            PickupLatitude = request.PickupLatitude,
            PickupLongitude = request.PickupLongitude,
            DeliveryLocation = request.DeliveryLocation,
            DeliveryLatitude = request.DeliveryLatitude,
            DeliveryLongitude = request.DeliveryLongitude,
            CropQuantity = request.CropQuantity,
            DistanceKm = distanceKm,
            DistanceNote = note,
            EstimatedFare = fare,
            EstimatedTravelTimeMinutes = travelMinutes,
            EstimatedTransportCost = fare,
            AgreedTransportCost = request.AgreedTransportCost > 0 ? request.AgreedTransportCost : fare,
            BookingStatus = TransportBookingStatus.Requested,
            RequestedAt = DateTime.UtcNow
        };

        _context.TransportBookings.Add(booking);
        await _context.SaveChangesAsync();

        var txnLabel = $"TXN-{transaction.TransactionId}";
        await _transactionService.CreateNotificationAsync(
            transaction.Farmer?.UserId ?? 0, NotificationType.Transaction,
            "Transport requested",
            $"A transport booking ({booking.TransportBookingId}, {distanceKm:0.#} km, est. ₹{fare:0.##}) was requested for {txnLabel}.");
        await _transactionService.CreateNotificationAsync(
            transaction.Buyer?.UserId ?? 0, NotificationType.Transaction,
            "Transport requested",
            $"A transport booking ({booking.TransportBookingId}, {distanceKm:0.#} km, est. ₹{fare:0.##}) was requested for {txnLabel}.");

        return (booking, null);
    }

    public async Task<(bool Ok, string? Error)> UpdateStatusAsync(TransportBooking booking, TransportBookingStatus newStatus)
    {
        if (!IsValidTransition(booking.BookingStatus, newStatus))
            return (false, $"Cannot transition from {booking.BookingStatus} to {newStatus}.");

        var oldStatus = booking.BookingStatus;
        booking.BookingStatus = newStatus;
        if (newStatus == TransportBookingStatus.Confirmed) booking.ConfirmedAt = DateTime.UtcNow;
        if (newStatus == TransportBookingStatus.PickedUp) booking.PickupAt = DateTime.UtcNow;
        if (newStatus == TransportBookingStatus.Delivered) booking.DeliveredAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        if (booking.Transaction != null)
        {
            var txnLabel = $"TXN-{booking.Transaction.TransactionId}";
            var message = $"Transport booking {booking.TransportBookingId} for {txnLabel} moved from {oldStatus} to {newStatus}.";
            await _transactionService.CreateNotificationAsync(booking.Transaction.Farmer?.UserId ?? 0, NotificationType.Transaction, "Transport updated", message);
            await _transactionService.CreateNotificationAsync(booking.Transaction.Buyer?.UserId ?? 0, NotificationType.Transaction, "Transport updated", message);
        }

        return (true, null);
    }

    public static (decimal DistanceKm, string Note) ComputeDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
    {
        if ((lat1 == 0 && lon1 == 0) || (lat2 == 0 && lon2 == 0))
            return (0m, "Coordinates missing; distance not computed.");

        double ToRad(double deg) => deg * Math.PI / 180.0;

        const double earthRadiusKm = 6371.0;
        var dLat = ToRad((double)lat2 - (double)lat1);
        var dLon = ToRad((double)lon2 - (double)lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2)
                + Math.Cos(ToRad((double)lat1)) * Math.Cos(ToRad((double)lat2))
                * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        var distance = earthRadiusKm * c;

        if (distance < 0.1) return (0m, "Pickup and delivery points share a location.");
        return (Math.Round((decimal)distance, 2), $"Straight-line distance (Haversine). Odometer distance may vary.");
    }

    public static decimal EstimateFare(decimal distanceKm) => Math.Round(BaseFareInr + PerKmRateInr * distanceKm, 2);

    private static bool IsValidTransition(TransportBookingStatus current, TransportBookingStatus next)
    {
        return (current, next) switch
        {
            (TransportBookingStatus.Requested, TransportBookingStatus.Confirmed) => true,
            (TransportBookingStatus.Requested, TransportBookingStatus.Cancelled) => true,
            (TransportBookingStatus.Confirmed, TransportBookingStatus.PickupPending) => true,
            (TransportBookingStatus.Confirmed, TransportBookingStatus.Cancelled) => true,
            (TransportBookingStatus.PickupPending, TransportBookingStatus.PickedUp) => true,
            (TransportBookingStatus.PickupPending, TransportBookingStatus.Cancelled) => true,
            (TransportBookingStatus.PickedUp, TransportBookingStatus.InTransit) => true,
            (TransportBookingStatus.PickedUp, TransportBookingStatus.Cancelled) => true,
            (TransportBookingStatus.InTransit, TransportBookingStatus.Delivered) => true,
            (TransportBookingStatus.InTransit, TransportBookingStatus.Cancelled) => true,
            _ => false
        };
    }
}