using System;
using System.Collections.Generic;
using Models.Enums;

namespace Models;

public class Transaction
{
    public int TransactionId { get; set; }
    public int CropListingId { get; set; }
    public int FarmerId { get; set; }
    public int BuyerId { get; set; }
    public int OfferId { get; set; }
    public int CropId { get; set; }
    public decimal Quantity { get; set; }
    public decimal AgreedPrice { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime DeliveryDate { get; set; }
    public TransactionStatus TransactionStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    public CropListing CropListing { get; set; } = null!;
    public Farmer Farmer { get; set; } = null!;
    public Buyer Buyer { get; set; } = null!;
    public Offer Offer { get; set; } = null!;
    public Crop Crop { get; set; } = null!;

    public TransactionReceipt? TransactionReceipt { get; set; }
    public ICollection<TransportBooking> TransportBookings { get; set; } = new List<TransportBooking>();
}
