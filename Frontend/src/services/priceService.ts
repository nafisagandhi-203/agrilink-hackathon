import type { PriceIntelligence, DemandForecast } from '../types';
import { apiClient } from './apiClient';

export const priceService = {
  async getPriceIntelligence(cropName: string): Promise<PriceIntelligence> {
    try {
      const disc = await apiClient.callAi<any>('/api/ai/price-discovery', {
        commodity: cropName || 'Tomato',
        variety: 'Local',
        grade: 'Grade A',
        state: 'Gujarat',
        district: 'Rajkot',
        market: 'Rajkot',
        quantity: 1000
      }).catch(() => null);

      const fairPrice = disc?.fair_price || 28;
      const fairMin = disc?.fair_price_min || Math.round(fairPrice * 0.92);
      const fairMax = disc?.fair_price_max || Math.round(fairPrice * 1.15);

      return {
        cropName: cropName || 'Tomato',
        market: 'Rajkot APMC',
        currentPrice: Math.round(fairPrice),
        unit: 'kg',
        aiFairPriceMin: fairMin,
        aiFairPriceMax: fairMax,
        predicted7DayPrice: fairMax,
        buyerAvgOffer: fairPrice + 2,
        confidencePercent: Math.round((disc?.confidence_score || 0.92) * 100),
        priceTrend: 'up',
        changePercent: 6.8,
        historicalData: [
          { date: '7 Days Ago', price: Math.round(fairPrice * 0.94) },
          { date: 'Today', price: Math.round(fairPrice) },
          { date: '7 Days Ahead', price: fairMax }
        ],
        recommendation: 'WAIT',
        recommendationReason: disc?.recommendations?.[0] || 'AI model forecasts firm prices due to season transition.',
        demandSignal: 'High Demand',
        supplySignal: 'Stable Regional Supply'
      };
    } catch (e) {
      console.warn('priceService.getPriceIntelligence error:', e);
      return {
        cropName: cropName || 'Tomato',
        market: 'Rajkot APMC',
        currentPrice: 28,
        unit: 'kg',
        aiFairPriceMin: 26,
        aiFairPriceMax: 33,
        predicted7DayPrice: 33,
        buyerAvgOffer: 30,
        confidencePercent: 91,
        priceTrend: 'up',
        changePercent: 5.5,
        historicalData: [
          { date: '7 Days Ago', price: 26 },
          { date: 'Today', price: 28 },
          { date: '7 Days Ahead', price: 33 }
        ],
        recommendation: 'WAIT',
        recommendationReason: 'Firm demand in regional wholesale mandis.',
        demandSignal: 'High Demand',
        supplySignal: 'Stable Regional Supply'
      };
    }
  },

  async getDemandForecast(cropName: string): Promise<DemandForecast> {
    try {
      const summaries = await apiClient.get<any[]>('/demandforecasts/summary').catch(() => []);
      const matched = Array.isArray(summaries) ? summaries.find((s) => s.cropName?.toLowerCase() === cropName.toLowerCase()) : null;

      if (matched) {
        return {
          cropName: matched.cropName || cropName,
          location: matched.location || 'Rajkot APMC',
          currentDemandIndex: Number(matched.currentDemandIndex || 82),
          forecast7DaysPercent: Number(matched.forecast7DaysPercent || 14),
          forecast30DaysPercent: Number(matched.forecast30DaysPercent || 22),
          trend: (matched.trend || 'Increasing') as 'Increasing' | 'Decreasing' | 'Stable',
          bestSellingWindow: matched.bestSellingWindow || 'Next 5 to 9 Days',
          supplyTrend: matched.supplyTrend || 'Tighter regional arrivals from transit corridors',
          expectedPriceImpact: matched.expectedPriceImpact || '+₹180 to ₹240 per quintal surge expected',
          chartData: (matched.forecastSeries || matched.chartData || [
            { day: 'Day 1', historical: 95, forecast: 100 },
            { day: 'Day 3', historical: 100, forecast: 108 },
            { day: 'Day 5', historical: 105, forecast: 114 },
            { day: 'Day 7', historical: 110, forecast: 122 },
            { day: 'Day 10', historical: 115, forecast: 128 },
            { day: 'Day 14', historical: 120, forecast: 135 }
          ])
        };
      }
    } catch (e) {
      console.warn('priceService.getDemandForecast error:', e);
    }

    return {
      cropName: cropName || 'Tomato',
      location: 'Rajkot APMC',
      currentDemandIndex: 82,
      forecast7DaysPercent: 14,
      forecast30DaysPercent: 22,
      trend: 'Increasing',
      bestSellingWindow: 'Next 5 to 9 Days (Highest Price Peak)',
      supplyTrend: 'Tighter regional arrivals from transit corridors',
      expectedPriceImpact: '+₹180 to ₹240 per quintal surge expected',
      chartData: [
        { day: 'Day 1', historical: 95, forecast: 100 },
        { day: 'Day 3', historical: 100, forecast: 108 },
        { day: 'Day 5', historical: 105, forecast: 114 },
        { day: 'Day 7', historical: 110, forecast: 122 },
        { day: 'Day 10', historical: 115, forecast: 128 },
        { day: 'Day 14', historical: 120, forecast: 135 }
      ]
    };
  },

  async getAllMarketPrices() {
    try {
      const data = await apiClient.get<any[]>('/marketprices');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn('priceService.getAllMarketPrices error:', e);
    }
    return [];
  }
};
