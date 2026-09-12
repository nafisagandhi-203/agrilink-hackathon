using System;
using Models.Enums;

namespace Models;

public class SellingInsight
{
    public int SellingInsightId { get; set; }
    public int CropListingId { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal FairPrice { get; set; }
    public decimal PredictedFuturePrice { get; set; }
    public RecommendationType Recommendation { get; set; }
    public string Reason { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; }
    public DateTime GeneratedAt { get; set; }

    public CropListing CropListing { get; set; } = null!;
}
