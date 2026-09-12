using HackathonProject.DTOs;

namespace HackathonProject.Services.AI
{
    public interface IAIService
    {
        Task<PricePredictionResultDto?> GetPricePredictionAsync(PricePredictionRequestDto request);
        Task<PriceDiscoveryResultDto?> GetPriceDiscoveryAsync(PriceDiscoveryRequestDto request);
        Task<BuyerMatchingResultDto?> GetBuyerMatchingAsync(BuyerMatchingRequestDto request);
        Task<AnomalyCheckResultDto?> CheckOfferAnomalyAsync(AnomalyCheckRequestDto request);
        Task<bool> IsHealthyAsync();
    }
}
