using System;
using System.Collections.Generic;

namespace DTOs;

public class DayPointDto
{
    public string Day { get; set; } = string.Empty;
    public decimal Historical { get; set; }
    public decimal Forecast { get; set; }
    public decimal Value { get; set; }
}

public class DemandForecastSummaryDto
{
    public int CropId { get; set; }
    public string CropName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public int CurrentDemandIndex { get; set; }
    public int Forecast7DaysPercent { get; set; }
    public string Trend { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; }
    public DateTime ForecastForDate { get; set; }
    public decimal PredictedDemandKg { get; set; }
    public string BestSellingWindow { get; set; } = string.Empty;
    public string SupplyTrend { get; set; } = string.Empty;
    public string ExpectedPriceImpact { get; set; } = string.Empty;
    public List<DayPointDto> Historical { get; set; } = new List<DayPointDto>();
    public List<DayPointDto> ForecastSeries { get; set; } = new List<DayPointDto>();
}