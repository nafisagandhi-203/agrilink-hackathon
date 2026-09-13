import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiClient } from '../services/apiClient';

interface DemandSummaryData {
  cropName: string;
  location: string;
  currentDemandIndex: number;
  forecast7DaysPercent: number;
  forecast30DaysPercent?: number;
  trend: string;
  bestSellingWindow: string;
  supplyTrend: string;
  expectedPriceImpact: string;
  chartData: { day: string; forecast: number }[];
}

export const DemandForecastPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedLocation, setSelectedLocation] = useState('Rajkot');
  const [timeframe, setTimeframe] = useState<'7days' | '30days'>('7days');
  const [liveSummaries, setLiveSummaries] = useState<Record<string, DemandSummaryData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    apiClient.get<any[]>('/demandforecasts/summary')
      .then((data) => {
        if (!isMounted || !Array.isArray(data)) return;
        const mapped: Record<string, DemandSummaryData> = {};
        data.forEach((item) => {
          const chartData = (item.forecastSeries || item.historical || []).map((pt: any) => ({
            day: pt.day || 'Day',
            forecast: Number(pt.value || pt.forecast || pt.historical || 100)
          }));
          mapped[item.cropName] = {
            cropName: item.cropName,
            location: item.location || 'Rajkot APMC',
            currentDemandIndex: item.currentDemandIndex || 78,
            forecast7DaysPercent: item.forecast7DaysPercent || 12,
            trend: item.trend || 'Increasing',
            bestSellingWindow: item.bestSellingWindow || 'Next 5 to 9 Days',
            supplyTrend: item.supplyTrend || 'Stable incoming volume',
            expectedPriceImpact: item.expectedPriceImpact || '+₹150 to ₹220/q surge expected',
            chartData: chartData.length > 0 ? chartData : [
              { day: 'Day 1', forecast: 100 },
              { day: 'Day 3', forecast: 106 },
              { day: 'Day 5', forecast: 112 },
              { day: 'Day 7', forecast: 120 },
              { day: 'Day 10', forecast: 125 },
              { day: 'Day 14', forecast: 132 }
            ]
          };
        });
        setLiveSummaries(mapped);
      })
      .catch((err) => {
        console.warn('Unable to load live demand summaries from backend:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const defaultForecast: DemandSummaryData = {
    cropName: selectedCrop,
    location: `${selectedLocation} APMC`,
    currentDemandIndex: selectedCrop === 'Tomato' ? 82 : selectedCrop === 'Wheat' ? 71 : 75,
    forecast7DaysPercent: selectedCrop === 'Tomato' ? 14 : 6,
    trend: 'Increasing',
    bestSellingWindow: 'Next 5 to 9 Days (Highest Price Peak)',
    supplyTrend: 'Tighter regional arrivals from transit corridors',
    expectedPriceImpact: '+₹180 to ₹240 per quintal surge expected',
    chartData: [
      { day: 'Day 1', forecast: 100 },
      { day: 'Day 3', forecast: 108 },
      { day: 'Day 5', forecast: 114 },
      { day: 'Day 7', forecast: 122 },
      { day: 'Day 10', forecast: 128 },
      { day: 'Day 14', forecast: 135 }
    ]
  };

  const forecast = liveSummaries[selectedCrop] || defaultForecast;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 animate-plant-grow">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#538d22]" />
            <span>AI Predictive Demand Engine • Live Analytics</span>
            {isLoading && <span className="ml-2 text-[10px] text-[#538d22] animate-pulse">Syncing...</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">AI Demand Forecasting</h1>
          <p className="text-xs text-[#4b633d] font-medium">Anticipate market consumption surges and optimal selling windows for maximum farmer profits.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#e2ebd9] bg-white text-xs font-extrabold text-[#143601] cursor-pointer"
          >
            <option value="Tomato">🍅 Tomato</option>
            <option value="Wheat">🌾 Wheat</option>
            <option value="Onion">🧅 Onion</option>
            <option value="Cotton">☁️ Cotton</option>
            <option value="Potato">🥔 Potato</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#e2ebd9] bg-white text-xs font-extrabold text-[#143601] cursor-pointer"
          >
            <option value="Rajkot">📍 Rajkot APMC</option>
            <option value="Gondal">📍 Gondal APMC</option>
            <option value="Ahmedabad">📍 Ahmedabad APMC</option>
          </select>

          <div className="flex items-center p-1 bg-white border border-[#e2ebd9] rounded-xl">
            <button
              onClick={() => setTimeframe('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                timeframe === '7days' ? 'bg-[#143601] text-white shadow-xs' : 'text-[#4b633d]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                timeframe === '30days' ? 'bg-[#143601] text-white shadow-xs' : 'text-[#4b633d]'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f4f8f0] pb-4">
          <div>
            <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">Demand Trajectory Index</span>
            <h3 className="text-lg font-black text-[#143601] flex items-center gap-2">
              <span>🟢 {selectedCrop} demand in {selectedLocation} is projected to increase by +{forecast.forecast7DaysPercent}% over the next 2 weeks.</span>
            </h3>
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#143601] text-[#aad576]">
            {forecast.trend} Trend
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.8} />
              <XAxis dataKey="day" stroke="#4b633d" fontSize={11} />
              <YAxis stroke="#4b633d" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#143601', color: '#fff', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="forecast" stroke="#538d22" fill="#538d22" fillOpacity={0.15} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1.5">
          <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">Best Selling Window</span>
          <p className="text-sm font-black text-[#143601]">{forecast.bestSellingWindow}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1.5">
          <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">Supply Trend</span>
          <p className="text-sm font-black text-[#143601]">{forecast.supplyTrend}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1.5">
          <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">Expected Price Impact</span>
          <p className="text-sm font-black text-[#538d22]">{forecast.expectedPriceImpact}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1.5">
          <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">Demand Strength Index</span>
          <p className="text-2xl font-black text-[#143601] flex items-center gap-1">
            <span>{forecast.currentDemandIndex}</span>
            <span className="text-xs text-[#4b633d] font-bold">/ 100</span>
          </p>
        </div>
      </div>

    </div>
  );
};
