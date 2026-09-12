using System;
using Models.Enums;

namespace DTOs;

public class SellingInsightDto
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
}

public class CreateSellingInsightDto
{
    public int CropListingId { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal FairPrice { get; set; }
    public decimal PredictedFuturePrice { get; set; }
    public RecommendationType Recommendation { get; set; }
    public string Reason { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; }
}

public class UpdateSellingInsightDto
{
    public int CropListingId { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal FairPrice { get; set; }
    public decimal PredictedFuturePrice { get; set; }
    public RecommendationType Recommendation { get; set; }
    public string Reason { get; set; } = string.Empty;
    public decimal ConfidenceScore { get; set; }
}
