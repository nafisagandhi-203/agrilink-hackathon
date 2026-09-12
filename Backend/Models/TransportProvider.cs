using System;
using System.Collections.Generic;

namespace Models;

public class TransportProvider
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
    public DateTime CreatedAt { get; set; }

    public ICollection<TransportBooking> TransportBookings { get; set; } = new List<TransportBooking>();
}
