using System;
using Models.Enums;

namespace Models;

public class DemandForecast
{
    public int DemandForecastId { get; set; }
    public int CropId { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime ForecastDate { get; set; }
    public DateTime ForecastForDate { get; set; }
    public decimal PredictedDemand { get; set; }
    public string DemandUnit { get; set; } = string.Empty;
    public DemandTrend DemandTrend { get; set; }
    public decimal ConfidenceScore { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Crop Crop { get; set; } = null!;
}
