using System;

namespace DTOs;

public class PriceForecastSummaryDto
{
    public int CropId { get; set; }
    public string CropName { get; set; } = string.Empty;
    public decimal CurrentAvgPrice { get; set; }
    public decimal ForecastPrice { get; set; }
    public decimal ForecastPercent { get; set; }
    public string Trend { get; set; } = "Stable";
    public decimal ConfidenceScore { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime LastUpdated { get; set; }
}