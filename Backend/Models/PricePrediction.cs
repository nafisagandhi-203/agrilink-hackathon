using System;

namespace Models;

public class PricePrediction
{
    public int PricePredictionId { get; set; }
    public int CropId { get; set; }
    public string Location { get; set; } = string.Empty;
    public string QualityGrade { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal CurrentMarketPrice { get; set; }
    public decimal FairPriceMin { get; set; }
    public decimal FairPriceMax { get; set; }
    public decimal PredictedPrice { get; set; }
    public DateTime PredictionDate { get; set; }
    public DateTime PredictionForDate { get; set; }
    public decimal ConfidenceScore { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public Crop Crop { get; set; } = null!;
}
