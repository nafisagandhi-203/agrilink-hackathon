using System;

namespace Models;

public class MarketPrice
{
    public int MarketPriceId { get; set; }
    public int CropId { get; set; }
    public string MarketName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public decimal ModalPrice { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime PriceDate { get; set; }
    public string Source { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Crop Crop { get; set; } = null!;
}
