using System;
using Models.Enums;

namespace Models;

public class TransportBooking
{
    public int TransportBookingId { get; set; }
    public int TransactionId { get; set; }
    public int TransportProviderId { get; set; }
    public string PickupLocation { get; set; } = string.Empty;
    public decimal PickupLatitude { get; set; }
    public decimal PickupLongitude { get; set; }
    public string DeliveryLocation { get; set; } = string.Empty;
    public decimal DeliveryLatitude { get; set; }
    public decimal DeliveryLongitude { get; set; }
    public decimal CropQuantity { get; set; }
    public decimal DistanceKm { get; set; }
    public int EstimatedTravelTimeMinutes { get; set; }
    public decimal EstimatedTransportCost { get; set; }
    public decimal AgreedTransportCost { get; set; }
    public TransportBookingStatus BookingStatus { get; set; }
    public DateTime RequestedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? PickupAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    public Transaction Transaction { get; set; } = null!;
    public TransportProvider TransportProvider { get; set; } = null!;
}
