using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DTOs;
using Services;

namespace Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class PriceForecastsController : ControllerBase
{
    private readonly IPriceIntelligenceService _priceIntelligenceService;

    public PriceForecastsController(IPriceIntelligenceService priceIntelligenceService)
    {
        _priceIntelligenceService = priceIntelligenceService;
    }

    // GET: api/PriceForecasts/summary
    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PriceForecastSummaryDto>>>> GetPriceSummaries()
    {
        var summaries = await _priceIntelligenceService.GetPriceSummariesAsync();
        return Ok(ApiResponse<IEnumerable<PriceForecastSummaryDto>>.SuccessResponse(summaries, "Price forecasts computed from live market data"));
    }

    // POST: api/PriceForecasts/refresh (idempotent; recomputes from live data on demand)
    [Authorize(Roles = "Admin")]
    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PriceForecastSummaryDto>>>> RefreshPriceForecasts()
    {
        var summaries = await _priceIntelligenceService.GetPriceSummariesAsync();
        return Ok(ApiResponse<IEnumerable<PriceForecastSummaryDto>>.SuccessResponse(summaries, "Price forecasts recomputed"));
    }
}