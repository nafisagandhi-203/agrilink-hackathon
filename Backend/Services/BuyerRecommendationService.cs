using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Enums;

namespace Services;

/// <summary>
/// Generates BuyerRecommendation rows by scoring every available crop listing
/// against every open buyer requirement. Idempotent upsert keyed on
/// (CropListingId, BuyerId) so repeated calls never create duplicates.
/// </summary>
public class BuyerRecommendationService
{
    private readonly ApplicationDbContext _context;

    public BuyerRecommendationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task EnsureRecommendationsAsync()
    {
        var requirements = await _context.BuyerRequirements
            .Where(r => r.Status == "Open" || r.Status == string.Empty)
            .ToListAsync();

        var listings = await _context.CropListings
            .Where(l => l.Status == CropListingStatus.Available && l.AvailableQuantity > 0)
            .ToListAsync();

        if (requirements.Count == 0 || listings.Count == 0)
            return;

        var existing = await _context.BuyerRecommendations.ToListAsync();
        var reqByCrop = requirements.GroupBy(r => r.CropId);

        var toAdd = new List<BuyerRecommendation>();
        var toUpdate = new List<BuyerRecommendation>();
        var seenKeys = new HashSet<(int CropListingId, int BuyerId)>(
            existing.Select(e => (e.CropListingId, e.BuyerId)));

        foreach (var group in reqByCrop)
        {
            foreach (var listing in listings.Where(l => l.CropId == group.Key))
            {
                foreach (var requirement in group)
                {
                    var (compatibility, crop, quantity, quality, location, price, date, reason) =
                        Score(requirement, listing);

                    if (!seenKeys.Add((listing.CropListingId, requirement.BuyerId)))
                        continue;

                    var record = existing.FirstOrDefault(e =>
                        e.CropListingId == listing.CropListingId && e.BuyerId == requirement.BuyerId);

                    if (record == null)
                    {
                        toAdd.Add(new BuyerRecommendation
                        {
                            CropListingId = listing.CropListingId,
                            BuyerId = requirement.BuyerId,
                            CompatibilityScore = compatibility,
                            CropMatchScore = crop,
                            QuantityMatchScore = quantity,
                            QualityMatchScore = quality,
                            LocationMatchScore = location,
                            PriceMatchScore = price,
                            DateMatchScore = date,
                            RecommendationReason = reason,
                            GeneratedAt = DateTime.UtcNow
                        });
                    }
                    else
                    {
                        record.CompatibilityScore = compatibility;
                        record.CropMatchScore = crop;
                        record.QuantityMatchScore = quantity;
                        record.QualityMatchScore = quality;
                        record.LocationMatchScore = location;
                        record.PriceMatchScore = price;
                        record.DateMatchScore = date;
                        record.RecommendationReason = reason;
                        record.GeneratedAt = DateTime.UtcNow;
                        toUpdate.Add(record);
                    }
                }
            }
        }

        if (toAdd.Count > 0) _context.BuyerRecommendations.AddRange(toAdd);
        if (toUpdate.Count > 0) _context.BuyerRecommendations.UpdateRange(toUpdate);
        await _context.SaveChangesAsync();
    }

    private static (decimal Compatibility, decimal Crop, decimal Quantity, decimal Quality,
        decimal Location, decimal Price, decimal Date, string Reason) Score(
        BuyerRequirement requirement, CropListing listing)
    {
        var cropScore = listing.CropId == requirement.CropId ? 100m : 0m;

        var maxQty = requirement.MaxQuantity > 0 ? requirement.MaxQuantity : requirement.RequiredQuantity;
        var minQty = requirement.MinQuantity > 0 ? requirement.MinQuantity : requirement.RequiredQuantity;
        decimal quantityScore;
        if (listing.AvailableQuantity >= minQty && listing.AvailableQuantity <= maxQty)
            quantityScore = 100m;
        else if (listing.AvailableQuantity < minQty)
            quantityScore = Math.Round(listing.AvailableQuantity / minQty * 100m);
        else
            quantityScore = Math.Round(maxQty / listing.AvailableQuantity * 100m);

        var qualityScore = GradeMatchScore(requirement.QualityGrade, listing.QualityGrade);

        decimal locationScore;
        if (string.Equals(listing.District, requirement.District, StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(listing.District))
            locationScore = 100m;
        else if (string.Equals(listing.State, requirement.State, StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(listing.State))
            locationScore = 70m;
        else
            locationScore = 40m;

        decimal priceScore;
        if (requirement.OfferedPrice >= listing.AskingPrice)
            priceScore = 100m;
        else if (requirement.OfferedPrice >= listing.AskingPrice * 0.85m)
            priceScore = 80m;
        else if (requirement.OfferedPrice >= listing.AskingPrice * 0.70m)
            priceScore = 60m;
        else
            priceScore = 30m;

        decimal dateScore;
        if (listing.ExpectedSellingDate <= requirement.PurchaseDate && listing.ExpectedSellingDate != default)
            dateScore = 100m;
        else if (listing.ExpectedSellingDate <= requirement.PurchaseDate.AddDays(14) && listing.ExpectedSellingDate != default)
            dateScore = 70m;
        else
            dateScore = 40m;

        var compatibility = Math.Round(
            cropScore * 0.30m + quantityScore * 0.20m + qualityScore * 0.10m +
            locationScore * 0.15m + priceScore * 0.15m + dateScore * 0.10m);

        var reasons = new List<string>();
        if (cropScore == 100m) reasons.Add($"Crop match confirmed (CropId {listing.CropId})");
        if (quantityScore >= 100m) reasons.Add($"Quantity ({listing.AvailableQuantity} {listing.Unit}) fits within your required range");
        else reasons.Add($"Quantity available: {listing.AvailableQuantity} {listing.Unit}");
        if (qualityScore >= 80m) reasons.Add($"Accepts {listing.QualityGrade} quality (your grade: {requirement.QualityGrade})");
        if (locationScore >= 70m)
            reasons.Add($"Located in {(string.IsNullOrEmpty(listing.District) ? listing.State : listing.District)}");
        if (priceScore >= 80m) reasons.Add($"Your offer of ₹{requirement.OfferedPrice}/unit meets the asking price");
        else reasons.Add($"Asking price ₹{listing.AskingPrice}/unit vs your offer ₹{requirement.OfferedPrice}/unit");
        if (dateScore >= 100m) reasons.Add("Selling date is before your required purchase date");

        return (compatibility, cropScore, quantityScore, qualityScore, locationScore, priceScore, dateScore,
            string.Join(". ", reasons.Take(4)) + ".");
    }

    private static decimal GradeMatchScore(string buyerGrade, string listingGrade)
    {
        if (string.IsNullOrEmpty(buyerGrade) && string.IsNullOrEmpty(listingGrade)) return 100m;
        if (string.IsNullOrEmpty(buyerGrade) || string.IsNullOrEmpty(listingGrade)) return 60m;
        if (string.Equals(buyerGrade, listingGrade, StringComparison.OrdinalIgnoreCase)) return 100m;
        if (buyerGrade.Contains(listingGrade, StringComparison.OrdinalIgnoreCase) ||
            listingGrade.Contains(buyerGrade, StringComparison.OrdinalIgnoreCase)) return 80m;
        return 50m;
    }
}