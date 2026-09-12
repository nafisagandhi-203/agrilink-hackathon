using System;


namespace DTOs;

public class AbnormalPriceAlertDto
{
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
}

public class CreateAbnormalPriceAlertDto
{
    public int? CropListingId { get; set; }
    public int? BuyerId { get; set; }
    public int? OfferId { get; set; }
    public decimal ExpectedPrice { get; set; }
    public decimal OfferedPrice { get; set; }
    public decimal DifferencePercentage { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
}

public class UpdateAbnormalPriceAlertDto
{
    public int? CropListingId { get; set; }
    public int? BuyerId { get; set; }
    public int? OfferId { get; set; }
    public decimal ExpectedPrice { get; set; }
    public decimal OfferedPrice { get; set; }
    public decimal DifferencePercentage { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
}
