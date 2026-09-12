import React from 'react';
import { Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MapView } from '../../components/MapView';

interface TransporterDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const TransporterDashboard: React.FC<TransporterDashboardProps> = () => {
  const { transportBookings, updateTransportStatus } = useData();

  const activeBooking = transportBookings[0];

  return (
    <div className="space-y-6 animate-plant-grow">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#143601] via-[#1a4301] to-[#245501] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#538d22]/40">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#538d22]/30 text-[#aad576] text-xs font-extrabold border border-[#73a942]/40">
            <ShieldCheck className="w-4 h-4 text-[#aad576]" />
            <span>Verified Freight Partner • Raj Transport Services</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome Back, Vikram Singh 🚛
          </h1>
          <p className="text-xs sm:text-sm text-[#aad576] font-medium max-w-xl">
            Tata 407 (GJ-03-BW-7890) • Rating 4.8 ⭐ • 142 Completed Freight Shipments.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
          <span className="text-xs text-[#aad576] font-bold block">Total Logistics Earnings</span>
          <span className="text-2xl font-black text-white">₹1,84,500</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1">
          <span className="text-xs text-[#4b633d] font-extrabold block">Available Requests</span>
          <span className="text-2xl font-black text-[#538d22]">3</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1">
          <span className="text-xs text-[#4b633d] font-extrabold block">Active Deliveries</span>
          <span className="text-2xl font-black text-[#143601]">1</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1">
          <span className="text-xs text-[#4b633d] font-extrabold block">Completed Jobs</span>
          <span className="text-2xl font-black text-[#538d22]">142</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1">
          <span className="text-xs text-[#4b633d] font-extrabold block">Fleet Rating</span>
          <span className="text-2xl font-black text-amber-500">4.8 ⭐</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2ebd9] shadow-2xs space-y-1">
          <span className="text-xs text-[#4b633d] font-extrabold block">Per Km Fare</span>
          <span className="text-2xl font-black text-[#143601]">₹18/km</span>
        </div>
      </div>

      <MapView
        pickupLocation={activeBooking?.pickupLocation || "Farm Gate #42, Gondal Highway, Rajkot"}
        deliveryLocation={activeBooking?.deliveryLocation || "Warehouse 7, Naroda GIDC, Ahmedabad"}
        distanceKm={activeBooking?.distanceKm || 215}
        eta={activeBooking?.eta || "3h 20m"}
        estimatedCost={activeBooking?.estimatedCost || 3870}
        showTransporterBtn={false}
      />

      {activeBooking && (
        <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#f4f8f0] pb-3">
            <h3 className="text-base font-black text-[#143601]">
              Driver Status Controls for Booking #{activeBooking.id}
            </h3>
            <span className="text-xs font-black text-[#538d22] bg-[#f4f8f0] px-3 py-1 rounded-full border border-[#e2ebd9]">
              Current: {activeBooking.status}
            </span>
          </div>

          <p className="text-xs text-[#4b633d] font-medium">Update shipment progress to automatically notify both Farmer and Buyer in real-time:</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => updateTransportStatus(activeBooking.id, 'Pickup Completed')}
              className="py-3 px-4 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#aad576]" />
              <span>Mark Pickup Completed</span>
            </button>

            <button
              onClick={() => updateTransportStatus(activeBooking.id, 'In Transit')}
              className="py-3 px-4 rounded-2xl bg-[#538d22] hover:bg-[#73a942] text-white font-extrabold text-xs shadow flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-white" />
              <span>Mark In Transit</span>
            </button>

            <button
              onClick={() => updateTransportStatus(activeBooking.id, 'Delivered')}
              className="py-3 px-4 rounded-2xl bg-[#245501] hover:bg-[#143601] text-white font-extrabold text-xs shadow flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#aad576]" />
              <span>Mark Shipment Delivered</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
