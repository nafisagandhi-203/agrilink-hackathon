namespace HackathonProject.DTOs
{
    // AI Request DTOs
    public class PricePredictionRequestDto
    {
        public string Commodity { get; set; } = string.Empty;
        public string Variety { get; set; } = "Local";
        public string Grade { get; set; } = "FAQ";
        public string State { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Market { get; set; } = string.Empty;
        public double Quantity { get; set; } = 1000;
        public string TargetDate { get; set; } = string.Empty;
    }

    public class PriceDiscoveryRequestDto
    {
        public string Commodity { get; set; } = string.Empty;
        public string Variety { get; set; } = "Local";
        public string Grade { get; set; } = "FAQ";
        public string State { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Market { get; set; } = string.Empty;
        public double Quantity { get; set; } = 1000;
        public string Date { get; set; } = string.Empty;
    }

    public class BuyerMatchingRequestDto
    {
        public string Commodity { get; set; } = string.Empty;
        public string Variety { get; set; } = "Local";
        public string Grade { get; set; } = "FAQ";
        public double Quantity { get; set; } = 1000;
        public string FarmerDistrict { get; set; } = string.Empty;
        public string FarmerState { get; set; } = string.Empty;
        public double MarketPrice { get; set; } = 0;
    }

    public class AnomalyCheckRequestDto
    {
        public string Commodity { get; set; } = string.Empty;
        public double MarketPrice { get; set; }
        public double OfferedPrice { get; set; }
        public double Quantity { get; set; } = 1000;
        public string Grade { get; set; } = "FAQ";
        public string BuyerId { get; set; } = string.Empty;
    }

    // AI Response DTOs
    public class PricePredictionResultDto
    {
        public double CurrentPrice { get; set; }
        public double PredictedPrice { get; set; }
        public double LowerPrice { get; set; }
        public double UpperPrice { get; set; }
        public int Confidence { get; set; }
        public string Trend { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
        public string RecommendationReason { get; set; } = string.Empty;
        public double SevenDayAvg { get; set; }
        public double FourteenDayAvg { get; set; }
        public double ThirtyDayAvg { get; set; }
        public double Volatility { get; set; }
        public WeatherInfoDto? Weather { get; set; }
        public List<PriceChartPointDto> ChartData { get; set; } = new();
        public string ModelVersion { get; set; } = string.Empty;
    }

    public class WeatherInfoDto
    {
        public string RiskLevel { get; set; } = string.Empty;
        public double RainfallMm { get; set; }
        public double Deviation { get; set; }
        public string Recommendation { get; set; } = string.Empty;
    }

    public class PriceChartPointDto
    {
        public string Date { get; set; } = string.Empty;
        public double Price { get; set; }
        public bool Predicted { get; set; }
    }

    public class PriceDiscoveryResultDto
    {
        public double FairPrice { get; set; }
        public double LowerBound { get; set; }
        public double UpperBound { get; set; }
        public int Confidence { get; set; }
        public string Trend { get; set; } = string.Empty;
        public List<MarketComparisonDto> MarketComparisons { get; set; } = new();
        public List<string> Explanation { get; set; } = new();
    }

    public class MarketComparisonDto
    {
        public string Market { get; set; } = string.Empty;
        public double AvgPrice { get; set; }
        public double MinPrice { get; set; }
        public double MaxPrice { get; set; }
    }

    public class BuyerMatchingResultDto
    {
        public List<BuyerMatchDto> Matches { get; set; } = new();
        public int Total { get; set; }
    }

    public class BuyerMatchDto
    {
        public string BuyerId { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public double MatchScore { get; set; }
        public double OfferedPrice { get; set; }
        public double RequiredQuantity { get; set; }
        public string AcceptedGrade { get; set; } = string.Empty;
        public double DistanceKm { get; set; }
        public double ReliabilityScore { get; set; }
        public double Rating { get; set; }
        public List<string> Reasons { get; set; } = new();
    }

    public class AnomalyCheckResultDto
    {
        public bool IsAbnormal { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
        public double AnomalyScore { get; set; }
        public double DeviationPercent { get; set; }
        public List<string> Reasons { get; set; } = new();
        public NormalRangeDto? NormalRange { get; set; }
    }

    public class NormalRangeDto
    {
        public double MarketPrice { get; set; }
        public double ExpectedMin { get; set; }
        public double ExpectedMax { get; set; }
    }
}
