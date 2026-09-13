using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Enums;

namespace Services;

public interface IPriceIntelligenceService
{
    Task<List<PriceForecastSummaryDto>> GetPriceSummariesAsync();
}

/// <summary>
/// Data-driven per-crop price forecasts computed from real listings and recent
/// trades (the same DB-proxy discipline as IntelligenceService). The endpoint is
/// intentionally cheap and deterministic; heavy AI inference lives in the
/// FastAPI-backed AIService behind POST endpoints.
/// </summary>
public class PriceIntelligenceService : IPriceIntelligenceService
{
    private readonly Data.ApplicationDbContext _context;

    public PriceIntelligenceService(Data.ApplicationDbContext context) => _context = context;

    public async Task<List<PriceForecastSummaryDto>> GetPriceSummariesAsync()
    {
        var now = DateTime.UtcNow;
        var cut14 = now.AddDays(-14);
        var cut28 = now.AddDays(-28);

        var crops = await _context.Crops.ToListAsync();
        var listings = await _context.CropListings
            .Where(l => l.Status == CropListingStatus.Available)
            .ToListAsync();
        var recentTx = await _context.Transactions
            .Where(t => t.CreatedAt >= cut28)
            .ToListAsync();

        var summaries = new List<PriceForecastSummaryDto>();

        foreach (var crop in crops.OrderBy(c => c.CropName))
        {
            var cropListings = listings.Where(l => l.CropId == crop.CropId).Select(l => l.AskingPrice).ToList();
            var cropTx = recentTx.Where(t => t.CropId == crop.CropId).Select(t => t.AgreedPrice).ToList();

            if (cropListings.Count == 0 && cropTx.Count == 0) continue;

            var avgAsking = cropListings.Count > 0 ? cropListings.Average() : 0m;
            var avgTrade = cropTx.Count > 0 ? cropTx.Average() : 0m;

            decimal currentAvg = (avgTrade > 0 && cropTx.Count >= 2)
                ? Math.Round(avgTrade * 0.6m + (avgAsking > 0 ? avgAsking * 0.4m : avgTrade * 0.4m), 2)
                : (avgAsking > 0 ? Math.Round(avgAsking, 2) : Math.Round(avgTrade, 2));
            if (currentAvg <= 0) continue;

            var last14 = recentTx.Where(t => t.CropId == crop.CropId && t.CreatedAt >= cut14).Sum(t => t.Quantity);
            var prev14 = recentTx.Where(t => t.CropId == crop.CropId && t.CreatedAt >= cut28 && t.CreatedAt < cut14).Sum(t => t.Quantity);

            int trendSign;
            if (last14 > 0 && prev14 > 0 && last14 >= prev14 * 1.2m) trendSign = 1;
            else if (last14 > 0 && prev14 > 0 && last14 <= prev14 * 0.8m) trendSign = -1;
            else if (last14 > 0 && prev14 == 0) trendSign = 1;
            else if (last14 == 0 && prev14 > 0) trendSign = -1;
            else if (avgTrade > 0 && avgAsking > 0 && avgTrade >= avgAsking * 1.05m) trendSign = 1;
            else if (avgTrade > 0 && avgAsking > 0 && avgTrade <= avgAsking * 0.95m) trendSign = -1;
            else trendSign = 0;

            var rel = avgAsking > 0 && avgTrade > 0 ? (avgTrade - avgAsking) / avgAsking * 100m : 0m;
            var pct = trendSign switch
            {
                1 => Math.Max(2m, 4m + Math.Min(Math.Abs(rel), 6m)),
                -1 => -Math.Max(2m, 4m + Math.Min(Math.Abs(rel), 6m)),
                _ => 2m
            };

            var sampleCount = cropListings.Count + recentTx.Count(t => t.CropId == crop.CropId);
            var confidence = (decimal)Math.Round(Math.Clamp(0.35 + 0.05 * Math.Max(sampleCount, 1), 0.35, 0.95), 2);

            summaries.Add(new PriceForecastSummaryDto
            {
                CropId = crop.CropId,
                CropName = crop.CropName,
                CurrentAvgPrice = currentAvg,
                ForecastPercent = pct,
                ForecastPrice = Math.Round(currentAvg * (1m + pct / 100m), 2),
                Trend = trendSign switch
                {
                    1 => "Increasing",
                    -1 => "Decreasing",
                    _ => "Stable"
                },
                ConfidenceScore = confidence,
                Note = "Estimated from live market listings and recent trades",
                LastUpdated = now
            });
        }

        return summaries;
    }
}