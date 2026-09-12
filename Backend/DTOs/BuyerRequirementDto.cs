using System;

namespace DTOs;

public class BuyerRequirementDto
{
    public int BuyerRequirementId { get; set; }
    public int BuyerId { get; set; }
    public string BuyerName { get; set; } = string.Empty;
    public int CropId { get; set; }
    public string CropName { get; set; } = string.Empty;
    public decimal RequiredQuantity { get; set; }
    public string QualityGrade { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal OfferedPrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreateBuyerRequirementDto
{
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
}

public class UpdateBuyerRequirementDto
{
    public decimal RequiredQuantity { get; set; }
    public decimal OfferedPrice { get; set; }
    public string Status { get; set; } = string.Empty;
}
