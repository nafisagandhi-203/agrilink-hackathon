export interface WeatherAlert {
  id: string;
  type: 'heavy_rain' | 'storm' | 'heatwave';
  severity: 'high' | 'critical';
  title: string;
  description: string;
  region: string;
  expectedInDays: number;
  cropName: string;
  currentPricePerQtl: number;
  aiRecommendation: string;
  actions: {
    sellNow: boolean;
    viewBuyers: boolean;
  };
}

export interface BuyerEmergencyAlert {
  id: string;
  title: string;
  message: string;
  affectedCrops: string[];
  region: string;
  timestamp: string;
  actionText: string;
  targetTab: string;
}

export const weatherService = {
  getFarmerWeatherAlert(): WeatherAlert | null {
    return {
      id: 'weather-alert-01',
      type: 'heavy_rain',
      severity: 'high',
      title: '⚠ Heavy Rain Alert',
      description: 'Heavy rainfall is expected in your area (Saurashtra / Rajkot region) within the next 2 days.',
      region: 'Rajkot, Gujarat',
      expectedInDays: 2,
      cropName: 'Tomato',
      currentPricePerQtl: 2450,
      aiRecommendation: 'Heavy rainfall expected in 2 days. Tomato prices are currently favorable (₹2,450/Qtl). AI Recommendation: Consider selling within the next 24–48 hours before rain affects harvest quality and market supply.',
      actions: {
        sellNow: true,
        viewBuyers: true
      }
    };
  },

  getBuyerEmergencyAlert(): BuyerEmergencyAlert | null {
    return {
      id: 'buyer-emerg-01',
      title: '🚨 Emergency Crop Availability',
      message: 'Heavy rainfall forecast in Saurashtra region may affect harvested Tomato and Vegetable crops. Farmers need immediate buyers to prevent harvest loss.',
      affectedCrops: ['Tomato', 'Wheat', 'Onion'],
      region: 'Rajkot / Saurashtra Corridor',
      timestamp: 'Just now',
      actionText: 'View Available Crops',
      targetTab: 'marketplace'
    };
  }
};
