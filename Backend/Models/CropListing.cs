using System;
using System.Collections.Generic;
using Models.Enums;

namespace Models;

public class CropListing
{
    public int CropListingId { get; set; }
    public int FarmerId { get; set; }
    public int CropId { get; set; }
    public decimal Quantity { get; set; }
    public decimal AvailableQuantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string QualityGrade { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public DateTime ExpectedSellingDate { get; set; }
    public decimal AskingPrice { get; set; }
    public CropListingStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Farmer Farmer { get; set; } = null!;
    public Crop Crop { get; set; } = null!;

    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    public ICollection<BuyerRecommendation> BuyerRecommendations { get; set; } = new List<BuyerRecommendation>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    public ICollection<SellingInsight> SellingInsights { get; set; } = new List<SellingInsight>();
    public ICollection<AbnormalPriceAlert> AbnormalPriceAlerts { get; set; } = new List<AbnormalPriceAlert>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
