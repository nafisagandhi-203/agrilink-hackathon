using System;

namespace Models;

public class BuyerRequirement
{
    public int BuyerRequirementId { get; set; }
    public int BuyerId { get; set; }
    public int CropId { get; set; }
    public decimal RequiredQuantity { get; set; }
    public decimal MinQuantity { get; set; }
    public decimal MaxQuantity { get; set; }
    public string QualityGrade { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public decimal OfferedPrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Buyer Buyer { get; set; } = null!;
    public Crop Crop { get; set; } = null!;
}
