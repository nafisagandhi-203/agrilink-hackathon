import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, ChevronRight, Navigation, AlertCircle } from 'lucide-react';
import { MapView } from '../../components/MapView';
import { transportService } from '../../services/transportService';
import type { TransporterProfile } from '../../types';
import { BackButton } from '../../components/BackButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface TransportationProps {
  setActiveTab: (tab: string) => void;
}

export const Transportation: React.FC<TransportationProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [transporters, setTransporters] = useState<TransporterProfile[]>([]);

  useEffect(() => {
    transportService.getTransporters().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setTransporters(data);
      }
    });
  }, []);

  const fallbackDashboard = role === 'admin' ? 'admin-dashboard' : role === 'buyer' ? 'buyer-dashboard' : 'farmer-dashboard';
  const [pickup, setPickup] = useState('My Farm Gate, Rajkot');
  const [delivery, setDelivery] = useState('Naroda Warehouse, Ahmedabad');
  const [quantityKg, setQuantityKg] = useState(500);

  // Dynamic Route Calculation State
  const [routeInfo, setRouteInfo] = useState({
    distanceKm: 215,
    eta: '3h 55m',
    estimatedCost: 3870
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showMap, setShowMap] = useState(true);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState<any>(null);

  const steps = [
    { num: 1, label: t('pickupLocation') || 'Pickup' },
    { num: 2, label: t('deliveryLocation') || 'Delivery' },
    { num: 3, label: t('smartTransportTitle') || 'Vehicle' },
    { num: 4, label: 'Confirm' }
  ];

  // Perform dynamic route calculation using transportService
  const handleCalculateRoute = () => {
    if (!delivery || delivery.trim().length === 0) {
      setErrorMessage('Please enter a valid delivery destination.');
      return;
    }

    setErrorMessage(null);
    setIsCalculating(true);

    setTimeout(() => {
      const calc = transportService.calculateRoute(pickup, delivery);
      setRouteInfo({
        distanceKm: calc.distanceKm,
        eta: calc.estimatedTimeText,
        estimatedCost: calc.estimatedCost
      });
      setIsCalculating(false);
      setShowMap(true);
      setCurrentStep(3);
    }, 300);
  };

  useEffect(() => {
    handleCalculateRoute();
  }, []);

  return (
    <div className="space-y-6 animate-plant-grow">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab={fallbackDashboard} setActiveTab={setActiveTab} />
        <span className="text-xs font-bold text-[#538d22] bg-[#f4f8f0] px-3 py-1 rounded-full border border-[#e2ebd9]">
          Logistics Corridor
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143601]">
          {t('arrangeTransport')}
        </h1>
        <p className="text-xs text-[#4b633d] font-medium">
          Book verified local trucks with real map routing & distance calculation
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs max-w-xl">
        {steps.map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(s.num)}
              className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center transition-all ${
                currentStep >= s.num
                  ? 'bg-[#143601] text-white shadow-2xs'
                  : 'bg-[#f4f8f0] text-[#4b633d]'
              }`}
            >
              {s.num}
            </button>
            <span className={`text-xs font-bold ${currentStep >= s.num ? 'text-[#143601]' : 'text-[#4b633d]'}`}>
              {s.label}
            </span>
            {s.num < 4 && <ChevronRight className="w-3.5 h-3.5 text-[#aad576] hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Form Card for Route Calculation Inputs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-extrabold text-[#538d22] uppercase tracking-wider block mb-1">
            📍 {t('pickupLocation')}
          </label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Enter pickup farm address"
            className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] text-xs font-semibold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-extrabold text-[#538d22] uppercase tracking-wider block mb-1">
            📍 {t('deliveryLocation')}
          </label>
          <input
            type="text"
            value={delivery}
            onChange={(e) => {
              setDelivery(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Enter destination market or warehouse"
            className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] text-xs font-semibold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-extrabold text-[#538d22] uppercase tracking-wider block mb-1">
            Quantity (kg)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] text-xs font-semibold text-[#143601] focus:ring-2 focus:ring-[#538d22] focus:outline-none"
            />
            <button
              onClick={handleCalculateRoute}
              disabled={isCalculating}
              className="px-4 py-2 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow-md shadow-[#143601]/20 transition-all flex items-center gap-1 shrink-0"
            >
              <Navigation className="w-3.5 h-3.5 text-[#aad576]" />
              <span>{t('calculateRoute')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message display if destination invalid */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Dynamic Leaflet Map Visualization */}
      {showMap && (
        <MapView
          pickupLocation={pickup}
          deliveryLocation={delivery}
          distanceKm={routeInfo.distanceKm}
          eta={routeInfo.eta}
          estimatedCost={routeInfo.estimatedCost}
          isCalculating={isCalculating}
          errorMessage={errorMessage}
          showTransporterBtn={false}
        />
      )}

      {/* Available Local Transporters List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#143601] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#538d22]" />
            <span>Available Verified Freight Transporters</span>
          </h2>
          <span className="text-xs font-bold text-[#4b633d]">
            Based on {routeInfo.distanceKm} km route
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transporters.map((trans) => {
            const calculatedCost = trans.pricePerKm * routeInfo.distanceKm;

            return (
              <div
                key={trans.id}
                className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs hover:border-[#538d22] transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-[#143601]">{trans.companyName}</h3>
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ⭐ {trans.rating}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#4b633d] space-y-0.5">
                    <p className="flex items-center gap-1.5">
                      <span>🚛 {trans.vehicleType}</span>
                      <span className="text-slate-400">({trans.vehicleNumber})</span>
                    </p>
                    <p>Capacity: {trans.capacityKg.toLocaleString()} kg</p>
                    <p className="text-[#538d22] text-[11px]">Rate: ₹{trans.pricePerKm}/km</p>
                  </div>

                  <div className="text-xl font-black text-[#143601] pt-1">
                    ₹{calculatedCost.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTransporter(trans);
                    setBookedSuccess(true);
                    setCurrentStep(4);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow transition-all"
                >
                  Book Transport
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Confirmation Dialog */}
      {bookedSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#143601]/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4 border border-[#e2ebd9] animate-plant-grow">
            <CheckCircle2 className="w-12 h-12 text-[#538d22] mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-[#143601]">Booking Confirmed!</h3>
            <p className="text-xs text-[#4b633d] font-medium leading-relaxed">
              {selectedTransporter?.companyName || 'Raj Transport'} ({selectedTransporter?.vehicleType || 'Tata 407'}) assigned to your harvest dispatch.
              <br />
              <span className="font-extrabold text-[#143601]">Route: {pickup} → {delivery} ({routeInfo.distanceKm} km)</span>
            </p>
            <button
              onClick={() => setBookedSuccess(false)}
              className="w-full py-2.5 rounded-xl bg-[#143601] text-white font-extrabold text-xs shadow"
            >
              Done & Track Delivery
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
