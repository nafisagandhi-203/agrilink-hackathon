import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  CloudRain,
  Users,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  Building2,
  PhoneCall,
  Eye,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { BackButton } from '../../components/BackButton';
import { aiIntelligenceService, type FarmerAiInput, type AiIntelligenceResult } from '../../services/aiIntelligenceService';

interface AIPriceIntelligenceProps {
  setActiveTab?: (tab: string) => void;
}

export const AIPriceIntelligence: React.FC<AIPriceIntelligenceProps> = ({ setActiveTab }) => {
  // Input State
  const [inputState, setInputState] = useState<FarmerAiInput>({
    crop: 'Tomato',
    location: 'Rajkot',
    quantityKg: 500,
    grade: 'Grade A (Premium)',
    season: 'Rabi Season',
    weatherCondition: 'Rain Expected in 3 Days'
  });

  // Dynamic AI Result State
  const [aiResult, setAiResult] = useState<AiIntelligenceResult>(
    aiIntelligenceService.getAnalysis(inputState)
  );

  const [isCalculating, setIsCalculating] = useState(false);

  // Section Refs for Smooth Scrolling from Summary Cards
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);

  const handleScrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    let isMounted = true;
    aiIntelligenceService.getAnalysisAsync(inputState).then((res) => {
      if (isMounted) setAiResult(res);
    });
    return () => { isMounted = false; };
  }, []);

  const handleGetAiRecommendation = async () => {
    setIsCalculating(true);
    try {
      const res = await aiIntelligenceService.getAnalysisAsync(inputState);
      setAiResult(res);
    } catch {
      setAiResult(aiIntelligenceService.getAnalysis(inputState));
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-8 animate-plant-grow pb-12">
      
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {setActiveTab && <BackButton fallbackTab="farmer-dashboard" setActiveTab={setActiveTab} />}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f4f8f0] text-[#143601] text-[11px] font-extrabold border border-[#e2ebd9] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#538d22]" />
              <span>AI Mandi Intelligence • Decision Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#143601] tracking-tight">
              AI Market Intelligence
            </h1>
            <p className="text-xs text-[#4b633d] font-medium">
              Helping farmers decide <strong>WHEN to sell</strong>, <strong>WHERE to sell</strong>, and <strong>WHO to sell to</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Farmer Inputs Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-[#538d22] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#538d22]" />
            <span>Step 1: Enter Crop & Farm Parameters</span>
          </h2>
          <span className="text-[11px] font-extrabold text-[#4b633d]">Real ML Endpoint Ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Crop Selector */}
          <div>
            <label className="text-[10px] font-extrabold text-[#143601] uppercase tracking-wider block mb-1">
              Crop
            </label>
            <select
              value={inputState.crop}
              onChange={(e) => setInputState({ ...inputState, crop: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-xs font-bold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none cursor-pointer"
            >
              <option value="Tomato">🍅 Tomato</option>
              <option value="Wheat">🌾 Wheat</option>
              <option value="Onion">🧅 Onion</option>
              <option value="Cotton">☁️ Cotton</option>
              <option value="Potato">🥔 Potato</option>
            </select>
          </div>

          {/* Location Selector */}
          <div>
            <label className="text-[10px] font-extrabold text-[#143601] uppercase tracking-wider block mb-1">
              Mandi / Region
            </label>
            <select
              value={inputState.location}
              onChange={(e) => setInputState({ ...inputState, location: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-xs font-bold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none cursor-pointer"
            >
              <option value="Rajkot">Rajkot APMC</option>
              <option value="Gondal">Gondal Mandi</option>
              <option value="Mahuva">Mahuva APMC</option>
              <option value="Vadodara">Vadodara APMC</option>
              <option value="Surat">Surat Mandi</option>
            </select>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="text-[10px] font-extrabold text-[#143601] uppercase tracking-wider block mb-1">
              Quantity (kg)
            </label>
            <input
              type="number"
              value={inputState.quantityKg}
              onChange={(e) => setInputState({ ...inputState, quantityKg: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-xs font-bold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
            />
          </div>

          {/* Grade Selector */}
          <div>
            <label className="text-[10px] font-extrabold text-[#143601] uppercase tracking-wider block mb-1">
              Quality Grade
            </label>
            <select
              value={inputState.grade}
              onChange={(e) => setInputState({ ...inputState, grade: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-xs font-bold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none cursor-pointer"
            >
              <option value="Grade A (Premium)">Grade A (Premium)</option>
              <option value="Grade B (Standard)">Grade B (Standard)</option>
              <option value="Grade C (Fair)">Grade C (Fair)</option>
            </select>
          </div>

          {/* Get AI Recommendation Action Button */}
          <div className="flex items-end">
            <button
              onClick={handleGetAiRecommendation}
              disabled={isCalculating}
              className="w-full py-2.5 px-4 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow-lg shadow-[#143601]/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
            >
              <Sparkles className={`w-4 h-4 text-[#aad576] ${isCalculating ? 'animate-spin' : 'animate-pulse'}`} />
              <span>{isCalculating ? 'Computing AI...' : 'Get AI Recommendation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. COMPACT AI MARKET INTELLIGENCE SUMMARY (6 Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#143601] flex items-center gap-2">
            <span>🤖 AI Market Intelligence Summary</span>
          </h2>
          <span className="text-xs text-[#4b633d] font-bold">Click card to jump to section</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div
            onClick={() => handleScrollTo(section1Ref)}
            className="p-3.5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#538d22] uppercase">🌾 Price Prediction</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#538d22] group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-base font-black text-[#143601] block">₹{aiResult.aiExpectedMinPerKg}–{aiResult.aiExpectedMaxPerKg}/kg</span>
            <span className="text-[10px] font-extrabold text-[#538d22]">Wait 3–5 days</span>
          </div>

          <div
            onClick={() => handleScrollTo(section2Ref)}
            className="p-3.5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#538d22] uppercase">📈 Fair Price</span>
              <BarChart3 className="w-3.5 h-3.5 text-[#538d22] group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-base font-black text-[#143601] block">₹{aiResult.fairPriceMinPerKg}–{aiResult.fairPriceMaxPerKg}/kg</span>
            <span className="text-[10px] font-bold text-[#4b633d]">Multi-market avg</span>
          </div>

          <div
            onClick={() => handleScrollTo(section3Ref)}
            className="p-3.5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#538d22] uppercase">🤝 Best Buyer</span>
              <Users className="w-3.5 h-3.5 text-[#538d22] group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-black text-[#143601] block truncate">{aiResult.recommendedBuyers[0]?.name}</span>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">96% Match</span>
          </div>

          <div
            onClick={() => handleScrollTo(section4Ref)}
            className="p-3.5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase">🌦️ Weather Risk</span>
              <CloudRain className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-black text-[#143601] block">High (78% Rain)</span>
            <span className="text-[10px] font-extrabold text-amber-900">Sell within 3 days</span>
          </div>

          <div
            onClick={() => handleScrollTo(section5Ref)}
            className="p-3.5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-md transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#538d22] uppercase">📊 Demand</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#538d22] group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-base font-black text-[#143601] block">{aiResult.predictedDemand}</span>
            <span className="text-[10px] font-bold text-[#4b633d]">Increasing trend</span>
          </div>

          <div
            onClick={() => handleScrollTo(section6Ref)}
            className="p-3.5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase">🚨 Price Protection</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-black text-rose-800 block">1 Low Offer (-55%)</span>
            <span className="text-[10px] font-extrabold text-rose-700">Warning Active</span>
          </div>

        </div>
      </div>

      {/* 1. AI-BASED CROP PRICE PREDICTION SECTION 🌾 */}
      <div ref={section1Ref} className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#f4f8f0] pb-4">
          <div>
            <span className="text-xs font-black text-[#538d22] uppercase tracking-wider block">WHEN TO SELL</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#143601]">1. AI Crop Price Prediction 🌾</h2>
          </div>
          <span className="text-xs font-bold text-[#538d22] bg-[#f4f8f0] px-3 py-1 rounded-full border border-[#e2ebd9]">
            Accuracy: 94.2%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Result Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#f4f8f0] to-white border border-[#e2ebd9] space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🍅</span>
                <div>
                  <h3 className="text-lg font-black text-[#143601]">{aiResult.crop}</h3>
                  <p className="text-xs text-[#4b633d] font-semibold">{aiResult.location} • {aiResult.grade}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#538d22] uppercase block">Current Spot Price</span>
                <span className="text-xl font-black text-[#143601]">₹{aiResult.currentPricePerKg} / kg</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e2ebd9] space-y-2">
              <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">AI Expected Price Range (5–7 Days)</span>
              <div className="text-3xl font-black text-[#143601] flex items-center gap-2">
                <span>₹{aiResult.aiExpectedMinPerKg} – ₹{aiResult.aiExpectedMaxPerKg}</span>
                <span className="text-xs font-extrabold text-[#538d22] bg-[#f4f8f0] px-2 py-0.5 rounded border border-[#e2ebd9]">
                  ↑ +18.5%
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#143601]">Prediction:</span>
                <span className="text-[#538d22] font-black">{aiResult.predictionTrend}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#143601]">Recommended Action:</span>
                <span className="text-slate-800 font-extrabold">{aiResult.recommendedAction}</span>
              </div>
            </div>
          </div>

          {/* Recharts Price Trend Chart */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-[#143601] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#538d22]" />
              <span>Price Trend Trajectory (Past → Current → Predicted)</span>
            </h4>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiResult.priceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="stage" stroke="#4b633d" fontSize={10} />
                  <YAxis stroke="#4b633d" fontSize={10} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#143601',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                    {aiResult.priceTrend.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'predicted' ? '#538d22' : entry.type === 'current' ? '#143601' : '#a3e635'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* 2. AI PRICE DISCOVERY SECTION 📈 */}
      <div ref={section2Ref} className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#f4f8f0] pb-4">
          <div>
            <span className="text-xs font-black text-[#538d22] uppercase tracking-wider block">WHERE TO SELL</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#143601]">2. AI Price Discovery 📈</h2>
          </div>
          <span className="text-xs font-extrabold text-[#143601] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Fair Price: ₹{aiResult.fairPriceMinPerKg}–{aiResult.fairPriceMaxPerKg}/kg
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Price Discovery Table */}
          <div className="border border-[#e2ebd9] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-[#f4f8f0] text-[#143601] font-black uppercase text-[10px] tracking-wider border-b border-[#e2ebd9]">
                <tr>
                  <th className="p-3">Source</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Price Offer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f8f0]">
                {aiResult.marketComparison.map((m, idx) => (
                  <tr key={idx} className={m.isBest ? 'bg-emerald-50 font-bold' : ''}>
                    <td className="p-3 font-bold text-[#143601] flex items-center gap-1.5">
                      <span>{m.source}</span>
                      {m.isBest && (
                        <span className="px-1.5 py-0.2 rounded bg-[#538d22] text-white text-[9px] font-black uppercase">
                          Best Price
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[#4b633d] capitalize">{m.type}</td>
                    <td className="p-3 text-right font-extrabold text-[#143601]">₹{m.pricePerKg} / kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Explanation & Fair Price Range Card */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9]">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">Calculated Fair Estimated Selling Price</span>
              <div className="text-3xl font-black text-[#143601]">
                ₹{aiResult.fairPriceMinPerKg} – ₹{aiResult.fairPriceMaxPerKg} / kg
              </div>
            </div>

            <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
              "{aiResult.priceDiscoveryExplanation}"
            </p>

            <div className="p-3 rounded-xl bg-white border border-[#e2ebd9] text-xs font-bold text-[#143601] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#538d22] shrink-0" />
              <span>Use this fair estimated range as negotiation leverage when talking with mandis or local traders.</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. AI FARMER-BUYER MATCHING SECTION 🤝 */}
      <div ref={section3Ref} className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#f4f8f0] pb-4">
          <div>
            <span className="text-xs font-black text-[#538d22] uppercase tracking-wider block">WHO TO SELL TO</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#143601]">3. Smart Buyer Matching 🤝</h2>
          </div>
          <span className="text-xs font-bold text-[#538d22]">Sorted by AI Match Score</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {aiResult.recommendedBuyers.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9]">
                    {b.badge}
                  </span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {b.matchScore}% Match
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#143601] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#538d22]" />
                    <span>{b.name}</span>
                  </h3>
                  <div className="text-xl font-black text-[#143601] pt-1">
                    ₹{b.pricePerKg} / kg
                  </div>
                  <p className="text-xs text-[#4b633d] font-semibold">
                    Required: {b.requiredQtyRange} • {b.distanceKm} km away
                  </p>
                </div>

                <div className="space-y-1 pt-1 border-t border-[#f4f8f0]">
                  <span className="text-[10px] font-black text-[#538d22] uppercase block">Match Reasons</span>
                  {b.reasons.map((r, i) => (
                    <p key={i} className="text-xs text-[#143601] font-semibold">{r}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#f4f8f0]">
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('farmer-buyers');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] font-extrabold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Buyer</span>
                </button>

                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('farmer-messages');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow transition-colors flex items-center justify-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#aad576]" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. WEATHER-BASED RECOMMENDATIONS SECTION 🌦️ */}
      <div ref={section4Ref} className="p-6 sm:p-7 rounded-3xl bg-amber-50/90 border-2 border-amber-300 shadow-sm space-y-4 text-amber-950">
        <div className="flex items-center justify-between border-b border-amber-200 pb-3">
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-6 h-6 text-amber-900 animate-bounce" />
            <div>
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">WEATHER + MARKET INTELLIGENCE</span>
              <h2 className="text-lg sm:text-xl font-black text-amber-950">4. Weather-Based Selling Recommendation 🌦️</h2>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-200 text-amber-900 uppercase">
            High Alert
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-semibold">
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
            <span className="text-amber-800 text-[10px] font-bold block">Current Weather</span>
            <span className="font-extrabold text-amber-950 text-sm">{aiResult.weatherCondition} ({aiResult.temperature})</span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
            <span className="text-amber-800 text-[10px] font-bold block">Rain Probability</span>
            <span className="font-extrabold text-amber-950 text-sm">{aiResult.rainProbability}</span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
            <span className="text-amber-800 text-[10px] font-bold block">Expected Forecast</span>
            <span className="font-extrabold text-amber-950 text-sm">{aiResult.expectedWeather}</span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
            <span className="text-amber-800 text-[10px] font-bold block">Market Supply Impact</span>
            <span className="font-extrabold text-amber-950 text-sm">Shortage & Price Rise</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-300 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>⚠️ Selling Recommendation</span>
          </div>
          <p className="text-xs text-slate-800 font-semibold leading-relaxed">
            "{aiResult.weatherRecommendation}"
          </p>
        </div>
      </div>

      {/* 5. AI DEMAND FORECASTING SECTION 📊 */}
      <div ref={section5Ref} className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#f4f8f0] pb-4">
          <div>
            <span className="text-xs font-black text-[#538d22] uppercase tracking-wider block">MARKET DEMAND TREND</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#143601]">5. AI Demand Forecasting 📊</h2>
          </div>
          <span className="text-xs font-bold text-[#538d22] bg-[#f4f8f0] px-3 py-1 rounded-full border border-[#e2ebd9]">
            Predicted Demand: {aiResult.predictedDemand}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#4b633d]">Current Demand Level:</span>
                <span className="text-[#143601] font-black">{aiResult.currentDemand}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#4b633d]">Predicted Demand (Next 30 Days):</span>
                <span className="text-[#538d22] font-black text-base">{aiResult.predictedDemand}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] space-y-1">
              <span className="text-[10px] font-black text-[#538d22] uppercase tracking-wider block">AI Forecast Insight</span>
              <p className="text-xs text-[#143601] font-semibold leading-relaxed">
                "{aiResult.demandRecommendation}"
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-[#143601]">Demand Trajectory Index (30 Days)</h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aiResult.demandForecastChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" stroke="#4b633d" fontSize={10} />
                  <YAxis stroke="#4b633d" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#143601', color: '#fff', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="demandIndex" stroke="#538d22" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 6. FRAUD / ABNORMAL PRICE DETECTION SECTION 🚨 */}
      <div ref={section6Ref} className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#f4f8f0] pb-4">
          <div>
            <span className="text-xs font-black text-rose-700 uppercase tracking-wider block">PROTECTING FARMERS</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#143601]">6. Smart Price Protection 🚨</h2>
          </div>
          <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Abnormal Price Safeguard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Suspicious Low Offer Card */}
          <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-950">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>{aiResult.suspiciousOffer.warningTitle}</span>
              </div>
              <span className="text-xs font-black text-rose-700 bg-rose-200 px-2 py-0.5 rounded">
                {aiResult.suspiciousOffer.differencePercent}% Below Market
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1 text-xs font-semibold">
              <p className="flex justify-between">
                <span className="text-slate-500">Market Range:</span>
                <span className="font-extrabold text-slate-900">₹{aiResult.normalRangeMinPerKg}–₹{aiResult.normalRangeMaxPerKg}/kg</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Trader Offer:</span>
                <span className="font-extrabold text-rose-700">₹{aiResult.suspiciousOffer.offeredPricePerKg}/kg</span>
              </p>
            </div>

            <p className="text-xs font-bold text-rose-900 leading-relaxed">
              "{aiResult.suspiciousOffer.warningDesc}"
            </p>
          </div>

          {/* Normal Fair Offer Card */}
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
                <ShieldCheck className="w-5 h-5 text-[#538d22]" />
                <span>{aiResult.fairOffer.statusTitle}</span>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                Fair Market Value
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1 text-xs font-semibold">
              <p className="flex justify-between">
                <span className="text-slate-500">Market Range:</span>
                <span className="font-extrabold text-slate-900">₹{aiResult.normalRangeMinPerKg}–₹{aiResult.normalRangeMaxPerKg}/kg</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">AgroCorp Offer:</span>
                <span className="font-extrabold text-[#538d22]">₹{aiResult.fairOffer.offeredPricePerKg}/kg</span>
              </p>
            </div>

            <p className="text-xs font-bold text-emerald-900 leading-relaxed">
              "{aiResult.fairOffer.statusDesc}"
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
