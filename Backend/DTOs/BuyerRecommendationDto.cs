using System;


namespace DTOs;

public class BuyerRecommendationDto
{
    public int BuyerRecommendationId { get; set; }
    public int CropListingId { get; set; }
    public int BuyerId { get; set; }
    public decimal CompatibilityScore { get; set; }
    public decimal CropMatchScore { get; set; }
    public decimal QuantityMatchScore { get; set; }
    public decimal QualityMatchScore { get; set; }
    public decimal LocationMatchScore { get; set; }
    public decimal PriceMatchScore { get; set; }
    public decimal DateMatchScore { get; set; }
    public string RecommendationReason { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
}

public class CreateBuyerRecommendationDto
{
    public int CropListingId { get; set; }
    public int BuyerId { get; set; }
    public decimal CompatibilityScore { get; set; }
    public decimal CropMatchScore { get; set; }
    public decimal QuantityMatchScore { get; set; }
    public decimal QualityMatchScore { get; set; }
    public decimal LocationMatchScore { get; set; }
    public decimal PriceMatchScore { get; set; }
    public decimal DateMatchScore { get; set; }
    public string RecommendationReason { get; set; } = string.Empty;
}

public class UpdateBuyerRecommendationDto
{
    public int CropListingId { get; set; }
    public int BuyerId { get; set; }
    public decimal CompatibilityScore { get; set; }
    public decimal CropMatchScore { get; set; }
    public decimal QuantityMatchScore { get; set; }
    public decimal QualityMatchScore { get; set; }
    public decimal LocationMatchScore { get; set; }
    public decimal PriceMatchScore { get; set; }
    public decimal DateMatchScore { get; set; }
    public string RecommendationReason { get; set; } = string.Empty;
}
