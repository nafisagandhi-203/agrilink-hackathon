using System;
using Models.Enums;

namespace DTOs;

public class TransportBookingDto
{
    public int TransportBookingId { get; set; }
    public int TransactionId { get; set; }
    public int TransportProviderId { get; set; }
    public string TransportProviderName { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public string VehicleNumber { get; set; } = string.Empty;
    public string PickupLocation { get; set; } = string.Empty;
    public decimal PickupLatitude { get; set; }
    public decimal PickupLongitude { get; set; }
    public string DeliveryLocation { get; set; } = string.Empty;
    public decimal DeliveryLatitude { get; set; }
    public decimal DeliveryLongitude { get; set; }
    public decimal CropQuantity { get; set; }
    public decimal DistanceKm { get; set; }
    public string? DistanceNote { get; set; }
    public decimal? EstimatedFare { get; set; }
    public int EstimatedTravelTimeMinutes { get; set; }
    public decimal EstimatedTransportCost { get; set; }
    public decimal AgreedTransportCost { get; set; }
    public string BookingStatus { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? PickupAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
}

public class CreateTransportBookingDto
{
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
}

public class UpdateTransportBookingStatusDto
{
    public string BookingStatus { get; set; } = string.Empty;
}

public class TransportProviderDto
{
    public int TransportProviderId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public string VehicleNumber { get; set; } = string.Empty;
    public decimal VehicleCapacity { get; set; }
    public string ServiceArea { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public bool IsAvailable { get; set; }
}
