import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AIInsightCardProps {
  cropName?: string;
  currentPrice?: string;
  fairPriceRange?: string;
  expectedPrice?: string;
  signalText?: string;
  confidencePercent?: number;
  onViewInsightClick?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  cropName = 'Tomato',
  currentPrice = '₹2,450 / qtl',
  fairPriceRange = '₹2,400 – ₹2,600',
  expectedPrice = '₹2,680',
  signalText = 'Wait for a better price',
  confidencePercent = 87,
  onViewInsightClick
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-sm hover:border-[#538d22] transition-all space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#143601] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#538d22]" />
          <span>{cropName}</span>
        </h3>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#f4f8f0] text-[#538d22] border border-[#e2ebd9]">
          {confidencePercent}% confidence
        </span>
      </div>

      <div className="text-2xl sm:text-3xl font-black text-[#143601]">{currentPrice}</div>

      <div className="grid grid-cols-2 gap-3 text-xs font-semibold border-t border-[#f4f8f0] pt-3">
        <div>
          <span className="text-[#4b633d] block font-bold">AI Fair Price:</span>
          <span className="text-[#143601] font-extrabold">{fairPriceRange}</span>
        </div>
        <div>
          <span className="text-[#4b633d] block font-bold">Expected Range:</span>
          <span className="text-[#538d22] font-black">{expectedPrice}</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[#f4f8f0] border border-[#e2ebd9] flex items-center justify-between text-xs font-extrabold text-[#143601]">
        <span>🟢 {signalText}</span>
      </div>

      {onViewInsightClick && (
        <button
          onClick={onViewInsightClick}
          className="w-full py-2.5 px-4 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow-md shadow-[#143601]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5"
        >
          <span>View Insight</span>
          <ArrowRight className="w-4 h-4 text-[#aad576]" />
        </button>
      )}
    </div>
  );
};
