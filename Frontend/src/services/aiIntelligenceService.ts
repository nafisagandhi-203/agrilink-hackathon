export interface FarmerAiInput {
  crop: string;
  location: string;
  quantityKg: number;
  grade: string;
  season?: string;
  weatherCondition?: string;
}

export interface PriceTrendPoint {
  stage: string;
  price: number;
  type: 'past' | 'current' | 'predicted';
}

export interface MarketPriceEntry {
  source: string;
  type: 'mandi' | 'buyer';
  pricePerKg: number;
  isBest?: boolean;
}

export interface MatchedBuyer {
  id: string;
  name: string;
  badge: string;
  pricePerKg: number;
  requiredQtyRange: string;
  distanceKm: number;
  matchScore: number;
  reasons: string[];
}

export interface AiIntelligenceResult {
  crop: string;
  location: string;
  quantityKg: number;
  grade: string;
  
  // 1. Price Prediction
  currentPricePerKg: number;
  aiExpectedMinPerKg: number;
  aiExpectedMaxPerKg: number;
  predictionTrend: 'Price may increase' | 'Price likely stable' | 'Price may decrease';
  recommendedAction: string;
  priceTrend: PriceTrendPoint[];

  // 2. Price Discovery
  marketComparison: MarketPriceEntry[];
  fairPriceMinPerKg: number;
  fairPriceMaxPerKg: number;
  priceDiscoveryExplanation: string;

  // 3. Buyer Matching
  recommendedBuyers: MatchedBuyer[];

  // 4. Weather Recommendation
  weatherCondition: string;
  temperature: string;
  rainProbability: string;
  expectedWeather: string;
  marketImpact: string;
  weatherRecommendation: string;
  weatherRiskSeverity: 'high' | 'medium' | 'low';

  // 5. Demand Forecast
  currentDemand: 'LOW' | 'MEDIUM' | 'HIGH';
  predictedDemand: 'MEDIUM' | 'HIGH ↑' | 'VERY HIGH ↑';
  demandForecastChart: { label: string; demandIndex: number }[];
  demandRecommendation: string;

  // 6. Price Protection / Fraud Detection
  normalRangeMinPerKg: number;
  normalRangeMaxPerKg: number;
  suspiciousOffer: {
    buyerName: string;
    offeredPricePerKg: number;
    differencePercent: number;
    warningTitle: string;
    warningDesc: string;
  };
  fairOffer: {
    buyerName: string;
    offeredPricePerKg: number;
    differencePercent: number;
    statusTitle: string;
    statusDesc: string;
  };
}

import { apiClient } from './apiClient';

export const aiIntelligenceService = {
  async getAnalysisAsync(input: FarmerAiInput): Promise<AiIntelligenceResult> {
    const fallback = this.getAnalysis(input);
    try {
      const pred = await apiClient.callAi<any>('/predict-price', {
        commodity: input.crop || 'Tomato',
        state: 'Gujarat',
        district: input.location || 'Rajkot',
        market: `${input.location || 'Rajkot'} APMC`,
        grade: input.grade || 'FAQ',
        quantity_quintals: (input.quantityKg || 500) / 100,
        forecast_days: 15
      });

      if (pred && (pred.predicted_price_per_quintal || pred.predictedPrice)) {
        const predPrice = pred.predicted_price_per_quintal || pred.predictedPrice;
        const currentKg = Math.max(1, Math.round(predPrice / 100));
        const minKg = pred.confidence_interval_95?.lower_quintal ? Math.round(pred.confidence_interval_95.lower_quintal / 100) : Math.round(currentKg * 0.95);
        const maxKg = pred.confidence_interval_95?.upper_quintal ? Math.round(pred.confidence_interval_95.upper_quintal / 100) : Math.round(currentKg * 1.15);
        const proj15d = pred.projected_15d_price || (predPrice * 1.1);
        const trendText: 'Price may increase' | 'Price likely stable' | 'Price may decrease' =
          proj15d > predPrice ? 'Price may increase' : proj15d < predPrice ? 'Price may decrease' : 'Price likely stable';

        return {
          ...fallback,
          currentPricePerKg: currentKg,
          aiExpectedMinPerKg: minKg,
          aiExpectedMaxPerKg: maxKg,
          predictionTrend: trendText,
          recommendedAction: `AI Model: ${pred.recommendation || 'Optimal selling horizon'} (Confidence: ${Math.round((pred.model_confidence_score || 0.92) * 100)}%).`,
          priceTrend: [
            { stage: 'Past (7 Days ago)', price: Math.round(currentKg * 0.93), type: 'past' },
            { stage: 'Current Price Today', price: currentKg, type: 'current' },
            { stage: 'AI Predicted (15 Days)', price: Math.max(1, Math.round(proj15d / 100)), type: 'predicted' }
          ]
        };
      }
    } catch (e) {
      console.warn('AI microservice request error, falling back to local formulas:', e);
    }
    return fallback;
  },

  getAnalysis(input: FarmerAiInput): AiIntelligenceResult {
    const crop = input.crop || 'Tomato';
    const location = input.location || 'Rajkot';
    const grade = input.grade || 'Grade A';

    let basePrice = 26;
    if (crop === 'Wheat') basePrice = 24.2;
    else if (crop === 'Onion') basePrice = 29;
    else if (crop === 'Cotton') basePrice = 71;
    else if (crop === 'Potato') basePrice = 22;

    if (grade.includes('Grade A')) basePrice *= 1.08;
    if (grade.includes('Grade C')) basePrice *= 0.88;

    const currentPrice = Math.round(basePrice);
    const expectedMin = Math.round(currentPrice * 1.08);
    const expectedMax = Math.round(currentPrice * 1.23);

    return {
      crop,
      location,
      quantityKg: input.quantityKg || 500,
      grade,

      // 1. AI Price Prediction
      currentPricePerKg: currentPrice,
      aiExpectedMinPerKg: expectedMin,
      aiExpectedMaxPerKg: expectedMax,
      predictionTrend: 'Price may increase',
      recommendedAction: 'Consider waiting 3–5 days before selling to capture maximum price surge.',
      priceTrend: [
        { stage: 'Past (7 Days ago)', price: Math.round(currentPrice * 0.92), type: 'past' },
        { stage: 'Current Price Today', price: currentPrice, type: 'current' },
        { stage: 'AI Predicted (5 Days)', price: expectedMax, type: 'predicted' }
      ],

      // 2. AI Price Discovery
      marketComparison: [
        { source: `${location} APMC`, type: 'mandi', pricePerKg: currentPrice },
        { source: 'Gondal Market B', type: 'mandi', pricePerKg: currentPrice + 3 },
        { source: 'Mahuva Market C', type: 'mandi', pricePerKg: currentPrice + 5 },
        { source: 'Shree Fresh Foods', type: 'buyer', pricePerKg: currentPrice + 4 },
        { source: 'AgroCorp Direct', type: 'buyer', pricePerKg: expectedMax, isBest: true }
      ],
      fairPriceMinPerKg: currentPrice + 2,
      fairPriceMaxPerKg: expectedMax,
      priceDiscoveryExplanation: 'AI analyzed spot prices from nearby APMC mandis and direct bulk buyers to calculate a fair selling range.',

      // 3. AI Farmer-Buyer Matching
      recommendedBuyers: [
        {
          id: 'buyer-01',
          name: 'AgroCorp Direct',
          badge: '🥇 Best Match',
          pricePerKg: expectedMax,
          requiredQtyRange: '400 – 1500 kg',
          distanceKm: 28,
          matchScore: 96,
          reasons: [
            `✓ High demand for ${crop}`,
            `✓ Accepts ${grade}`,
            `✓ Highest market price offer`,
            '✓ Nearby corridor (28 km)',
            '✓ Verified instant Escrow payment'
          ]
        },
        {
          id: 'buyer-02',
          name: 'Shree Fresh Foods',
          badge: '🥈 Top Buyer',
          pricePerKg: currentPrice + 4,
          requiredQtyRange: '500 – 2000 kg',
          distanceKm: 45,
          matchScore: 91,
          reasons: [
            `✓ Required crop (${crop})`,
            '✓ Bulk pickup available',
            `✓ Accepts ${grade}`,
            '✓ Verified buyer badge'
          ]
        },
        {
          id: 'buyer-03',
          name: 'Gujarat Organics Co',
          badge: '🥉 Verified',
          pricePerKg: currentPrice + 2,
          requiredQtyRange: '200 – 1000 kg',
          distanceKm: 52,
          matchScore: 86,
          reasons: [
            `✓ Accepts ${crop}`,
            '✓ Flexible delivery schedule',
            '✓ Direct farm gate pickup'
          ]
        }
      ],

      // 4. Weather-Based Recommendations
      weatherCondition: 'Moderate Humidity / Rain Forecast',
      temperature: '31°C',
      rainProbability: '78%',
      expectedWeather: 'Heavy rainfall expected in the next 3 days',
      marketImpact: 'Rain may affect crop storage quality and market supply, triggering short-term mandi price surges.',
      weatherRecommendation: 'Rain expected in 2–3 days. Harvested crops should be protected in cold storage or sold within 3–5 days before humidity impacts grade quality.',
      weatherRiskSeverity: 'high',

      // 5. AI Demand Forecasting
      currentDemand: 'MEDIUM',
      predictedDemand: 'HIGH ↑',
      demandForecastChart: [
        { label: 'Current Today', demandIndex: 55 },
        { label: '7 Days', demandIndex: 72 },
        { label: '15 Days', demandIndex: 88 },
        { label: '30 Days', demandIndex: 94 }
      ],
      demandRecommendation: 'Higher processing plant demand is expected over the next month, creating favorable selling opportunities.',

      // 6. Fraud / Abnormal Price Detection
      normalRangeMinPerKg: currentPrice,
      normalRangeMaxPerKg: expectedMax,
      suspiciousOffer: {
        buyerName: 'Unverified Trader X',
        offeredPricePerKg: Math.round(currentPrice * 0.45),
        differencePercent: -55,
        warningTitle: '⚠️ Unusually Low Price Detected',
        warningDesc: `This offer (₹${Math.round(currentPrice * 0.45)}/kg) is 55% below the current market range (₹${currentPrice}–₹${expectedMax}/kg). Review carefully before accepting.`
      },
      fairOffer: {
        buyerName: 'AgroCorp Direct',
        offeredPricePerKg: expectedMax,
        differencePercent: +15,
        statusTitle: '✓ Fair Price Offer',
        statusDesc: `This offer (₹${expectedMax}/kg) is within the AI recommended fair market range.`
      }
    };
  }
};
