using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DTOs;
using HackathonProject.DTOs;
using HackathonProject.Services.AI;

namespace HackathonProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aiService;

        public AIController(IAIService aiService)
        {
            _aiService = aiService;
        }

        /// <summary>
        /// Get AI price prediction for a commodity
        /// </summary>
        [HttpPost("price-prediction")]
        public async Task<ActionResult<ApiResponse<PricePredictionResultDto>>> GetPricePrediction(
            [FromBody] PricePredictionRequestDto request)
        {
            var result = await _aiService.GetPricePredictionAsync(request);
            if (result == null)
                return Ok(ApiResponse<PricePredictionResultDto>.ErrorResponse(
                    "Unable to generate price prediction. The AI service may be unavailable."));

            return Ok(ApiResponse<PricePredictionResultDto>.SuccessResponse(result, "Price prediction generated"));
        }

        /// <summary>
        /// Get fair price discovery for a commodity
        /// </summary>
        [HttpPost("price-discovery")]
        public async Task<ActionResult<ApiResponse<PriceDiscoveryResultDto>>> GetPriceDiscovery(
            [FromBody] PriceDiscoveryRequestDto request)
        {
            var result = await _aiService.GetPriceDiscoveryAsync(request);
            if (result == null)
                return Ok(ApiResponse<PriceDiscoveryResultDto>.ErrorResponse(
                    "Unable to generate price discovery. The AI service may be unavailable."));

            return Ok(ApiResponse<PriceDiscoveryResultDto>.SuccessResponse(result, "Price discovery generated"));
        }

        /// <summary>
        /// Get AI buyer matching for a farmer's listing
        /// </summary>
        [HttpPost("buyer-matching")]
        public async Task<ActionResult<ApiResponse<BuyerMatchingResultDto>>> GetBuyerMatching(
            [FromBody] BuyerMatchingRequestDto request)
        {
            var result = await _aiService.GetBuyerMatchingAsync(request);
            if (result == null)
                return Ok(ApiResponse<BuyerMatchingResultDto>.ErrorResponse(
                    "Unable to generate buyer matches. The AI service may be unavailable."));

            return Ok(ApiResponse<BuyerMatchingResultDto>.SuccessResponse(result, "Buyer matches generated"));
        }

        /// <summary>
        /// Check if a buyer offer is abnormally priced
        /// </summary>
        [HttpPost("check-offer")]
        public async Task<ActionResult<ApiResponse<AnomalyCheckResultDto>>> CheckOffer(
            [FromBody] AnomalyCheckRequestDto request)
        {
            var result = await _aiService.CheckOfferAnomalyAsync(request);
            if (result == null)
                return Ok(ApiResponse<AnomalyCheckResultDto>.ErrorResponse(
                    "Unable to check offer. The AI service may be unavailable."));

            return Ok(ApiResponse<AnomalyCheckResultDto>.SuccessResponse(result, "Offer check completed"));
        }

        /// <summary>
        /// Check AI service health
        /// </summary>
        [HttpGet("health")]
        [AllowAnonymous]
        public async Task<IActionResult> HealthCheck()
        {
            var isHealthy = await _aiService.IsHealthyAsync();
            return Ok(new { aiServiceHealthy = isHealthy });
        }
    }
}
