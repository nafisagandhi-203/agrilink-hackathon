using System.Collections.Generic;

namespace Models;

public class Crop
{
    public int CropId { get; set; }
    public string CropName { get; set; } = string.Empty;
    public string CommodityGroup { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    public ICollection<CropListing> CropListings { get; set; } = new List<CropListing>();
    public ICollection<BuyerRequirement> BuyerRequirements { get; set; } = new List<BuyerRequirement>();
    public ICollection<MarketPrice> MarketPrices { get; set; } = new List<MarketPrice>();
    public ICollection<PricePrediction> PricePredictions { get; set; } = new List<PricePrediction>();
    public ICollection<DemandForecast> DemandForecasts { get; set; } = new List<DemandForecast>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
