import type { PriceIntelligence, DemandForecast } from '../types';
import { mockPriceIntelligence, mockDemandForecasts } from '../data/mockData';

export const priceService = {
  async getPriceIntelligence(cropName: string): Promise<PriceIntelligence> {
    return mockPriceIntelligence[cropName] || mockPriceIntelligence['Tomato'];
  },

  async getDemandForecast(cropName: string): Promise<DemandForecast> {
    return mockDemandForecasts[cropName] || mockDemandForecasts['Tomato'];
  },

  async getAllMarketPrices() {
    return Object.values(mockPriceIntelligence);
  }
};
