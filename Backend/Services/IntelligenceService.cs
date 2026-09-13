using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Enums;

namespace Services;

public interface IIntelligenceService
{
    Task<List<DemandForecastSummaryDto>> GetDemandSummariesAsync();
    Task<List<DemandForecastSummaryDto>> RefreshDemandForecastsAsync();
}

public class IntelligenceService : IIntelligenceService
{
    private const string ModelVersion = "db-proxy-1";
    private readonly Data.ApplicationDbContext _context;

    public IntelligenceService(Data.ApplicationDbContext context) => _context = context;

    public async Task<List<DemandForecastSummaryDto>> GetDemandSummariesAsync()
    {
        var now = DateTime.UtcNow;
        var cut14 = now.AddDays(-14);
        var cut28 = now.AddDays(-28);

        var requirements = await _context.BuyerRequirements
            .Where(r => r.Status == "Open")
            .ToListAsync();
        var listings = await _context.CropListings
            .Where(l => l.Status == CropListingStatus.Available)
            .ToListAsync();
        var recentTx = await _context.Transactions
            .Where(t => t.CreatedAt >= cut28)
            .ToListAsync();
        var history = await _context.DemandForecasts
            .Where(f => f.ForecastDate < now.Date)
            .ToListAsync();

        var historyGroups = history
            .GroupBy(h => (h.CropId, Key: Normalize(h.Location)))
            .ToDictionary(g => g.Key, g => g.OrderBy(x => x.ForecastDate).ToList());

        var reqGroups = requirements
            .GroupBy(r => (r.CropId, dk: Normalize(r.District), sk: Normalize(r.State)))
            .ToDictionary(g => (g.Key.CropId, g.Key.dk), g => g.ToList());

        var listingGroups = listings
            .GroupBy(l => (l.CropId, dk: Normalize(l.District), sk: Normalize(l.State)))
            .ToDictionary(g => (g.Key.CropId, g.Key.dk), g => g.ToList());

        var keys = reqGroups.Keys.Union(listingGroups.Keys).ToList();

        var summaries = new List<DemandForecastSummaryDto>();
        foreach (var (cropId, districtKey) in keys.OrderBy(k => k.CropId))
        {
            var crop = await _context.Crops.FindAsync(cropId);
            if (crop == null) continue;

            reqGroups.TryGetValue((cropId, districtKey), out var reqList);
            listingGroups.TryGetValue((cropId, districtKey), out var listingList);

            var reqKg = reqList?.Sum(r => r.RequiredQuantity) ?? 0m;
            var supplyKg = listingList?.Sum(l => l.AvailableQuantity) ?? 0m;
            var reqCount = reqList?.Count ?? 0;
            var listingCount = listingList?.Count ?? 0;

            var last14 = recentTx.Where(t => t.CropId == cropId && t.CreatedAt >= cut14).Sum(t => t.Quantity);
            var prev14 = recentTx.Where(t => t.CropId == cropId && t.CreatedAt >= cut28 && t.CreatedAt < cut14).Sum(t => t.Quantity);
            var txUsed = last14 > 0 || prev14 > 0;
            var sampleCount = reqCount + listingCount + (txUsed ? (recentTx.Count(t => t.CropId == cropId)) : 0);

            int momentum;
            if (last14 > 0 && prev14 > 0 && last14 >= prev14 * 1.2m) momentum = 1;
            else if (last14 > 0 && prev14 > 0 && last14 <= prev14 * 0.8m) momentum = -1;
            else if (last14 > 0 && prev14 == 0) momentum = 1;
            else if (last14 == 0 && prev14 > 0) momentum = -1;
            else momentum = 0;

            var share = (reqKg + supplyKg) > 0 ? (double)(reqKg) / (double)(reqKg + supplyKg) : 0.5;
            var hasData = (reqKg + supplyKg) > 0;

            int trendSign;
            if (momentum != 0) trendSign = momentum;
            else if (!hasData) trendSign = 0;
            else if (reqKg >= supplyKg * 1.2m) trendSign = 1;
            else if (supplyKg >= reqKg * 1.2m) trendSign = -1;
            else trendSign = 0;

            var demandIndex = hasData ? Math.Clamp((int)Math.Round(share * 100), 15, 95) : 50;

            int forecastPct = trendSign switch
            {
                1 => 8 + Math.Clamp((int)Math.Round((share - 0.5) * 20), 0, 10),
                -1 => -10 - Math.Clamp((int)Math.Round((0.5 - share) * 10), 0, 5),
                _ => 2
            };

            var trend = trendSign switch
            {
                1 => DemandTrend.Increasing,
                -1 => DemandTrend.Decreasing,
                _ => DemandTrend.Stable
            };

            var confidence = (decimal)Math.Round(Math.Clamp(0.30 + 0.06 * sampleCount, 0.30, 0.95), 2);

            var district = FirstValue(reqList, listingList, r => r.District, l => l.District);
            var state = FirstValue(reqList, listingList, r => r.State, l => l.State);

            var summary = new DemandForecastSummaryDto
            {
                CropId = cropId,
                CropName = crop.CropName,
                District = district,
                State = state,
                Location = district,
                CurrentDemandIndex = demandIndex,
                Forecast7DaysPercent = forecastPct,
                Trend = trend.ToString(),
                ConfidenceScore = confidence,
                ForecastForDate = now.AddDays(7),
                BestSellingWindow = trend switch
                {
                    DemandTrend.Increasing => "Sell within 3–5 days (demand is climbing)",
                    DemandTrend.Decreasing => "Hold — selling window is softening",
                    _ => "Sell within the week"
                },
                SupplyTrend = !hasData ? "Insufficient data"
                    : supplyKg == 0 ? "Severe supply shortage"
                    : reqKg > supplyKg * 1.5m ? "Supply tightening"
                    : supplyKg > reqKg * 2m ? "Supply surplus"
                    : "Supply adequately matched",
                ExpectedPriceImpact = trend switch
                {
                    DemandTrend.Increasing => "Prices expected to firm",
                    DemandTrend.Decreasing => "Prices expected to soften",
                    _ => "Prices expected to hold steady"
                },
                PredictedDemandKg = reqKg,
                Historical = BuildHistory(historyGroups, cropId, Normalize(district), now),
                ForecastSeries = BuildForecast(demandIndex, forecastPct, now, 7, historyGroups, cropId, Normalize(district))
            };

            summaries.Add(summary);
        }

        return summaries.OrderBy(s => s.CropName).ThenBy(s => s.District).ToList();
    }

    public async Task<List<DemandForecastSummaryDto>> RefreshDemandForecastsAsync()
    {
        var summaries = await GetDemandSummariesAsync();
        if (summaries.Count == 0) return summaries;

        var now = DateTime.UtcNow;
        var today = now.Date;
        var staleCut = today.AddDays(-60).AddDays(-1);

        var existing = await _context.DemandForecasts
            .Where(f => f.ForecastDate >= today)
            .ToListAsync();
        _context.DemandForecasts.RemoveRange(existing.Where(e =>
            summaries.Any(s => s.CropId == e.CropId && Normalize(e.Location) == Normalize(s.District))));

        var stale = await _context.DemandForecasts
            .Where(f => f.ForecastDate < staleCut)
            .ToListAsync();
        _context.DemandForecasts.RemoveRange(stale);

        foreach (var s in summaries)
        {
            _context.DemandForecasts.Add(new DemandForecast
            {
                CropId = s.CropId,
                Location = string.IsNullOrWhiteSpace(s.District) ? "—" : s.District,
                ForecastDate = now,
                ForecastForDate = now.AddDays(7),
                PredictedDemand = s.PredictedDemandKg,
                DemandUnit = "kg",
                DemandTrend = Enum.TryParse<DemandTrend>(s.Trend, out var t) ? t : DemandTrend.Stable,
                ConfidenceScore = s.ConfidenceScore,
                ModelVersion = ModelVersion,
                CreatedAt = now
            });
        }

        await _context.SaveChangesAsync();
        return summaries;
    }

    private static string Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim().ToLowerInvariant();

    private static string FirstValue(
        List<BuyerRequirement>? reqList,
        List<CropListing>? listingList,
        Func<BuyerRequirement, string> reqPick,
        Func<CropListing, string> listingPick)
    {
        var fromReq = reqList?.Select(reqPick).FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
        if (!string.IsNullOrWhiteSpace(fromReq)) return fromReq!;
        var fromListing = listingList?.Select(listingPick).FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
        return string.IsNullOrWhiteSpace(fromListing) ? string.Empty : fromListing!;
    }

    private static List<DayPointDto> BuildHistory(
        Dictionary<(int, string), List<DemandForecast>> historyGroups,
        int cropId,
        string key,
        DateTime now)
    {
        if (!historyGroups.TryGetValue((cropId, key), out var rows)) return new List<DayPointDto>();

        return rows
            .Where(r => r.ForecastDate < now)
            .GroupBy(r => r.ForecastDate.Date)
            .OrderBy(g => g.Key)
            .Select(g => new DayPointDto
            {
                Day = g.Key.ToString("MMM d"),
                Value = g.Max(x => x.PredictedDemand)
            })
            .ToList();
    }

    private static List<DayPointDto> BuildForecast(
        int demandIndex,
        int forecastPct,
        DateTime now,
        int days,
        Dictionary<(int, string), List<DemandForecast>> historyGroups,
        int cropId,
        string key)
    {
        var curve = new List<DayPointDto>();
        var scaled = (double)demandIndex;
        var growth = Math.Pow(1.0 + (double)forecastPct / 100.0, 1.0 / Math.Max(days, 1));

        var historyValue = 0m;
        if (historyGroups.TryGetValue((cropId, key), out var rows))
        {
            historyValue = rows.Max(x => x.PredictedDemand);
        }

        for (var i = 1; i <= days; i++)
        {
            scaled *= historyValue > 0 ? 1.0 + ((double)forecastPct / 100.0) / days : growth;
            var historical = i == 1 && historyValue > 0 ? historyValue : (i == 1 ? demandIndex : 0m);
            curve.Add(new DayPointDto
            {
                Day = now.AddDays(i).ToString("MMM d"),
                Historical = i == 1 ? historical : 0m,
                Forecast = (int)Math.Round(Math.Clamp(Math.Round(scaled), 15, 98))
            });
        }

        return curve;
    }
}