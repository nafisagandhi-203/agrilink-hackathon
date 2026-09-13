import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AbnormalPriceMonitoringProps {
  setActiveTab: (tab: string) => void;
}

export const AbnormalPriceMonitoring: React.FC<AbnormalPriceMonitoringProps> = () => {
  const { alerts, dismissAlert } = useData();

  return (
    <div className="space-y-6 animate-plant-grow">
      
      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>Market Integrity Monitor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">AI Abnormal Price Monitoring Desk</h1>
        <p className="text-xs text-[#4b633d] font-medium">Automated system flags detecting predatory buyer offers and artificial market spikes.</p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f4f8f0] text-[#245501] uppercase font-bold">
              <tr>
                <th className="p-3">Crop Commodity</th>
                <th className="p-3">Buyer Name</th>
                <th className="p-3">Offered Price</th>
                <th className="p-3">AI Fair Range</th>
                <th className="p-3">Difference %</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8f0] font-semibold">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#4b633d]">
                    No abnormal price alerts flagged by AI monitoring.
                  </td>
                </tr>
              ) : (
                alerts.map((alt) => (
                  <tr key={alt.id}>
                    <td className="p-3 font-bold text-[#143601]">{alt.cropName}</td>
                    <td className="p-3">{alt.buyerName}</td>
                    <td className="p-3 text-rose-600 font-extrabold">₹{alt.offeredPrice}/q</td>
                    <td className="p-3 text-[#538d22] font-extrabold">₹{alt.fairPriceMin} – ₹{alt.fairPriceMax}</td>
                    <td className="p-3 font-bold text-rose-600">{alt.differencePercent}%</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                        alt.severity === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {alt.severity} Risk
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <button
                        onClick={() => dismissAlert(alt.id)}
                        className="px-3 py-1 rounded-xl bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] text-xs font-bold transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => alert(`Investigating buyer ${alt.buyerName}`)}
                        className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow transition-transform hover:scale-105"
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
