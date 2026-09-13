import React, { useState } from 'react';
import { Settings, Shield, Sliders, Save, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { BackButton } from '../../components/BackButton';

interface AdminSettingsPageProps {
  setActiveTab?: (tab: string) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();

  const [priceThreshold, setPriceThreshold] = useState(15);
  const [autoVerify, setAutoVerify] = useState(false);
  const [weatherBroadcast, setWeatherBroadcast] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        {setActiveTab ? (
          <BackButton fallbackTab="admin-dashboard" setActiveTab={setActiveTab} />
        ) : <div />}
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Platform Configuration Desk 🛡️
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#f4f8f0] p-5 sm:p-6 rounded-3xl border border-[#e2ebd9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#143601] text-xs font-bold border border-[#e2ebd9] mb-1.5">
          <Settings className="w-3.5 h-3.5 text-[#538d22]" />
          <span>System Governance Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#143601]">{t('settings')}</h1>
        <p className="text-xs text-[#4b633d] font-medium">Configure AgriPulse platform parameters, APMC verification defaults, and alert thresholds.</p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-6">
        
        {saved && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Platform Settings saved successfully!</span>
          </div>
        )}

        {/* Setting 1: System Language */}
        <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-[#143601]">System Preferred Language</h3>
            <p className="text-xs text-[#4b633d] font-medium">Select primary localization fallback across the AgriPulse platform.</p>
          </div>
          <LanguageSelector />
        </div>

        {/* Setting 2: Price Anomaly Sensitivity Threshold */}
        <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#143601] flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#538d22]" />
                <span>Price Anomaly Threshold Sensitivity</span>
              </h3>
              <p className="text-xs text-[#4b633d] font-medium">Flag offers exceeding baseline Mandi price variation by this percentage.</p>
            </div>
            <span className="text-sm font-black text-[#143601] bg-white px-3 py-1 rounded-xl border border-[#e2ebd9]">
              {priceThreshold}% Variation
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            value={priceThreshold}
            onChange={(e) => setPriceThreshold(Number(e.target.value))}
            className="w-full accent-[#538d22] cursor-pointer"
          />
        </div>

        {/* Setting 3: Emergency Weather Broadcast */}
        <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-[#143601] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#538d22]" />
              <span>Broadcast Emergency Weather Alerts</span>
            </h3>
            <p className="text-xs text-[#4b633d] font-medium">Automatically alert buyers and farmers during heavy rain or harvest risk weather events.</p>
          </div>
          <button
            type="button"
            onClick={() => setWeatherBroadcast(!weatherBroadcast)}
            className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer ${
              weatherBroadcast ? 'bg-[#143601]' : 'bg-slate-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              weatherBroadcast ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Setting 4: Auto Verification toggle */}
        <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-[#143601]">Auto-Verify Registered APMC Traders</h3>
            <p className="text-xs text-[#4b633d] font-medium">Instantly grant APMC badge to registered users with valid GST/Aadhaar numbers.</p>
          </div>
          <button
            type="button"
            onClick={() => setAutoVerify(!autoVerify)}
            className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer ${
              autoVerify ? 'bg-[#143601]' : 'bg-slate-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              autoVerify ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#aad576]" />
            <span>Save Platform Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
