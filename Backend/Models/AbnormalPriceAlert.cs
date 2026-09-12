using System;
using System.ComponentModel.DataAnnotations;

namespace Models;

public class AbnormalPriceAlert
{
    [Key]
    public int AlertId { get; set; }
    public int? CropListingId { get; set; }
    public int? BuyerId { get; set; }
    public int? OfferId { get; set; }
    public decimal ExpectedPrice { get; set; }
    public decimal OfferedPrice { get; set; }
    public decimal DifferencePercentage { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }

    public CropListing? CropListing { get; set; }
    public Buyer? Buyer { get; set; }       
    public Offer? Offer { get; set; }
}
