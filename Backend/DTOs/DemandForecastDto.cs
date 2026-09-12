using System;
using Models.Enums;

namespace DTOs;

public class DemandForecastDto
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
}

public class CreateDemandForecastDto
{
    public int CropId { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime ForecastDate { get; set; }
    public DateTime ForecastForDate { get; set; }
    public decimal PredictedDemand { get; set; }
    public string DemandUnit { get; set; } = string.Empty;
    public DemandTrend DemandTrend { get; set; }
    public decimal ConfidenceScore { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
}

public class UpdateDemandForecastDto
{
    public int CropId { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime ForecastDate { get; set; }
    public DateTime ForecastForDate { get; set; }
    public decimal PredictedDemand { get; set; }
    public string DemandUnit { get; set; } = string.Empty;
    public DemandTrend DemandTrend { get; set; }
    public decimal ConfidenceScore { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
}
