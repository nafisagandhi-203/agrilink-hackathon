using System.Net.Http.Json;
using System.Text.Json;
using HackathonProject.DTOs;

namespace HackathonProject.Services.AI
{
    public class AIService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AIService> _logger;

        private string AiBaseUrl => _configuration["AI:BaseUrl"] ?? "http://localhost:8000";

        public AIService(HttpClient httpClient, IConfiguration configuration, ILogger<AIService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<PricePredictionResultDto?> GetPricePredictionAsync(PricePredictionRequestDto request)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{AiBaseUrl}/api/ai/price-prediction", new
                {
                    commodity = request.Commodity,
                    variety = request.Variety,
                    grade = request.Grade,
                    state = request.State,
                    district = request.District,
                    market = request.Market,
                    quantity = request.Quantity,
                    target_date = request.TargetDate,
                });

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("AI price prediction returned {StatusCode}", response.StatusCode);
                    return null;
                }

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(json);

                return new PricePredictionResultDto
                {
                    CurrentPrice = GetDouble(result, "currentPrice"),
                    PredictedPrice = GetDouble(result, "predictedPrice"),
                    LowerPrice = GetDouble(result, "lowerPrice"),
                    UpperPrice = GetDouble(result, "upperPrice"),
                    Confidence = GetInt(result, "confidence"),
                    Trend = GetString(result, "trend") ?? "Stable",
                    Recommendation = GetString(result, "recommendation") ?? "STABLE",
                    RecommendationReason = GetString(result, "recommendationReason") ?? "",
                    SevenDayAvg = GetDouble(result, "sevenDayAvg"),
                    FourteenDayAvg = GetDouble(result, "fourteenDayAvg"),
                    ThirtyDayAvg = GetDouble(result, "thirtyDayAvg"),
                    Volatility = GetDouble(result, "volatility"),
                    ModelVersion = GetString(result, "modelVersion") ?? "1.0.0",
                    Weather = ParseWeather(result),
                    ChartData = ParseChartData(result),
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling AI price prediction service");
                return null;
            }
        }

        public async Task<PriceDiscoveryResultDto?> GetPriceDiscoveryAsync(PriceDiscoveryRequestDto request)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{AiBaseUrl}/api/ai/price-discovery", new
                {
                    commodity = request.Commodity,
                    variety = request.Variety,
                    grade = request.Grade,
                    state = request.State,
                    district = request.District,
                    market = request.Market,
                    quantity = request.Quantity,
                    date = request.Date,
                });

                if (!response.IsSuccessStatusCode) return null;

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(json);

                var comparisons = new List<MarketComparisonDto>();
                if (result.TryGetProperty("market_comparisons", out JsonElement comps))
                {
                    foreach (var comp in comps.EnumerateArray())
                    {
                        comparisons.Add(new MarketComparisonDto
                        {
                            Market = GetString(comp, "market") ?? "",
                            AvgPrice = GetDouble(comp, "avg_price"),
                            MinPrice = GetDouble(comp, "min_price"),
                            MaxPrice = GetDouble(comp, "max_price"),
                        });
                    }
                }

                var explanations = new List<string>();
                if (result.TryGetProperty("explanation", out JsonElement exps))
                {
                    foreach (var exp in exps.EnumerateArray())
                        explanations.Add(exp.GetString() ?? "");
                }

                return new PriceDiscoveryResultDto
                {
                    FairPrice = GetDouble(result, "fair_price"),
                    LowerBound = GetDouble(result, "lower_bound"),
                    UpperBound = GetDouble(result, "upper_bound"),
                    Confidence = GetInt(result, "confidence"),
                    Trend = GetString(result, "trend") ?? "Stable",
                    MarketComparisons = comparisons,
                    Explanation = explanations,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling AI price discovery service");
                return null;
            }
        }

        public async Task<BuyerMatchingResultDto?> GetBuyerMatchingAsync(BuyerMatchingRequestDto request)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{AiBaseUrl}/api/ai/buyer-matching", new
                {
                    commodity = request.Commodity,
                    variety = request.Variety,
                    grade = request.Grade,
                    quantity = request.Quantity,
                    farmer_district = request.FarmerDistrict,
                    farmer_state = request.FarmerState,
                    market_price = request.MarketPrice,
                });

                if (!response.IsSuccessStatusCode) return null;

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(json);

                var matches = new List<BuyerMatchDto>();
                if (result.TryGetProperty("matches", out JsonElement matchArr))
                {
                    foreach (var m in matchArr.EnumerateArray())
                    {
                        var reasons = new List<string>();
                        if (m.TryGetProperty("reasons", out JsonElement rArr))
                        {
                            foreach (var r in rArr.EnumerateArray())
                                reasons.Add(r.GetString() ?? "");
                        }

                        matches.Add(new BuyerMatchDto
                        {
                            BuyerId = GetString(m, "buyer_id") ?? "",
                            BusinessName = GetString(m, "business_name") ?? "",
                            MatchScore = GetDouble(m, "match_score"),
                            OfferedPrice = GetDouble(m, "offered_price"),
                            RequiredQuantity = GetDouble(m, "required_quantity"),
                            AcceptedGrade = GetString(m, "accepted_grade") ?? "",
                            DistanceKm = GetDouble(m, "distance_km"),
                            ReliabilityScore = GetDouble(m, "reliability_score"),
                            Rating = GetDouble(m, "rating"),
                            Reasons = reasons,
                        });
                    }
                }

                return new BuyerMatchingResultDto
                {
                    Matches = matches,
                    Total = GetInt(result, "total"),
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling AI buyer matching service");
                return null;
            }
        }

        public async Task<AnomalyCheckResultDto?> CheckOfferAnomalyAsync(AnomalyCheckRequestDto request)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{AiBaseUrl}/api/ai/check-offer", new
                {
                    commodity = request.Commodity,
                    market_price = request.MarketPrice,
                    offered_price = request.OfferedPrice,
                    quantity = request.Quantity,
                    grade = request.Grade,
                    buyer_id = request.BuyerId,
                });

                if (!response.IsSuccessStatusCode) return null;

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(json);

                var reasons = new List<string>();
                if (result.TryGetProperty("reasons", out JsonElement rArr))
                {
                    foreach (var r in rArr.EnumerateArray())
                        reasons.Add(r.GetString() ?? "");
                }

                NormalRangeDto? normalRange = null;
                if (result.TryGetProperty("normal_range", out JsonElement nr) &&
                    nr.ValueKind == JsonValueKind.Object)
                {
                    normalRange = new NormalRangeDto
                    {
                        MarketPrice = GetDouble(nr, "market_price"),
                        ExpectedMin = GetDouble(nr, "expected_min"),
                        ExpectedMax = GetDouble(nr, "expected_max"),
                    };
                }

                return new AnomalyCheckResultDto
                {
                    IsAbnormal = result.TryGetProperty("is_abnormal", out JsonElement abnormal) && abnormal.GetBoolean(),
                    RiskLevel = GetString(result, "risk_level") ?? "Unknown",
                    AnomalyScore = GetDouble(result, "anomaly_score"),
                    DeviationPercent = GetDouble(result, "deviation_percent"),
                    Reasons = reasons,
                    NormalRange = normalRange,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling AI anomaly check service");
                return null;
            }
        }

        public async Task<bool> IsHealthyAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{AiBaseUrl}/api/ai/health");
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        private WeatherInfoDto? ParseWeather(JsonElement result)
        {
            if (!result.TryGetProperty("weather", out JsonElement w) ||
                w.ValueKind != JsonValueKind.Object)
                return null;

            return new WeatherInfoDto
            {
                RiskLevel = GetString(w, "riskLevel") ?? "Low",
                RainfallMm = GetDouble(w, "rainfallMm"),
                Deviation = GetDouble(w, "deviation"),
                Recommendation = GetString(w, "recommendation") ?? "",
            };
        }

        private List<PriceChartPointDto> ParseChartData(JsonElement result)
        {
            var points = new List<PriceChartPointDto>();
            if (!result.TryGetProperty("chartData", out JsonElement chart) ||
                chart.ValueKind != JsonValueKind.Array)
                return points;

            foreach (var p in chart.EnumerateArray())
            {
                points.Add(new PriceChartPointDto
                {
                    Date = GetString(p, "date") ?? "",
                    Price = GetDouble(p, "price"),
                    Predicted = p.TryGetProperty("predicted", out JsonElement pred) && pred.GetBoolean(),
                });
            }
            return points;
        }

        private static double GetDouble(JsonElement element, string property)
        {
            if (element.TryGetProperty(property, out JsonElement value) &&
                value.ValueKind is JsonValueKind.Number or JsonValueKind.String)
            {
                return value.GetDouble();
            }
            return 0;
        }

        private static int GetInt(JsonElement element, string property)
        {
            if (element.TryGetProperty(property, out JsonElement value) &&
                value.ValueKind is JsonValueKind.Number)
            {
                return value.GetInt32();
            }
            return 0;
        }

        private static string? GetString(JsonElement element, string property)
        {
            if (element.TryGetProperty(property, out JsonElement value) &&
                value.ValueKind == JsonValueKind.String)
            {
                return value.GetString();
            }
            return null;
        }
    }
}