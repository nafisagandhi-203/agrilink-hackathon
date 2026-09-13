import React, { useState } from "react";
import {
  ShoppingBag,
  PlusCircle,
  Sparkles,
  ArrowRight,
  CloudRain,
  Eye,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useLanguage } from "../../context/LanguageContext";

import {
  weatherService,
  type BuyerEmergencyAlert,
} from "../../services/weatherService";

import { BackButton } from "../../components/BackButton";
import { ViewProfileModal } from "../../components/ViewProfileModal";
import { SendOfferModal } from "../../components/SendOfferModal";
import { CropImage } from "../../components/CropImage";

import type { CropListing } from "../../types";

interface BuyerDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  setActiveTab,
}) => {
  // =========================================================
  // AUTH
  // =========================================================

  const { user } = useAuth();

  // =========================================================
  // DATA
  // =========================================================

  const {
    crops = [],
    buyerRequirements = [],
    buyerOffers = [],
    transactions = [],
  } = useData();

  // =========================================================
  // LANGUAGE
  // =========================================================

  const { t } = useLanguage();

  // =========================================================
  // EMERGENCY WEATHER ALERT
  // =========================================================

  const [emergencyAlert] = useState<BuyerEmergencyAlert | null>(() => {
    try {
      return weatherService.getBuyerEmergencyAlert();
    } catch (error) {
      console.error("Failed to load buyer emergency alert:", error);
      return null;
    }
  });

  const [dismissedEmergency, setDismissedEmergency] =
    useState<boolean>(false);

  // =========================================================
  // MODALS
  // =========================================================

  const [selectedCropForOffer, setSelectedCropForOffer] =
    useState<CropListing | null>(null);

  const [selectedProfile, setSelectedProfile] =
    useState<any | null>(null);

  // =========================================================
  // SAFE DATA
  // =========================================================

  const safeCrops = Array.isArray(crops) ? crops : [];

  const safeBuyerRequirements = Array.isArray(buyerRequirements)
    ? buyerRequirements
    : [];

  const safeBuyerOffers = Array.isArray(buyerOffers)
    ? buyerOffers
    : [];

  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  // =========================================================
  // BUSINESS NAME
  // =========================================================

  const businessName =
    user?.businessDetails?.businessName ||
    user?.name ||
    "Buyer";

  // =========================================================
  // OPEN MARKETPLACE
  // =========================================================

  const openMarketplace = () => {
    setActiveTab("marketplace");
  };

  // =========================================================
  // OPEN REQUIREMENTS
  // =========================================================

  const openRequirements = () => {
    setActiveTab("buyer-requirements");
  };

  // =========================================================
  // OPEN OFFERS
  // =========================================================

  const openOffers = () => {
    setActiveTab("buyer-offers");
  };

  // =========================================================
  // OPEN TRANSACTIONS
  // =========================================================

  const openTransactions = () => {
    setActiveTab("buyer-transactions");
  };

  // =========================================================
  // VIEW FARMER PROFILE
  // =========================================================

  const viewFarmerProfile = (crop: CropListing) => {
    const farmerName =
      crop.farmerName || "Farmer";

    setSelectedProfile({
      name: farmerName,
      role: "farmer",

      /*
       * These are fallback values because the CropListing
       * type currently does not appear to contain the farmer's
       * complete contact information.
       */
      phone: "",
      email: "",

      location:
        crop.location ||
        "Location unavailable",

      verified: true,

      farmDetails: {
        pickupAddress:
          crop.pickupLocation ||
          crop.location ||
          "",
      },
    });
  };

  // =========================================================
  // MAKE OFFER
  // =========================================================

  const makeOffer = (crop: CropListing) => {
    setSelectedCropForOffer(crop);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6 animate-plant-grow">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <BackButton
          fallbackTab="home"
          setActiveTab={setActiveTab}
        />

        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          {t("buyerSourcingWorkspace")}
        </span>

      </div>

      {/* =====================================================
          HERO BANNER
      ===================================================== */}

      <div className="gradient-banner-buyer p-6 sm:p-7 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">

        <div className="space-y-2">

          {/* Badge */}

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-extrabold border border-blue-400/40 backdrop-blur-xs">

            <Sparkles className="w-3.5 h-3.5 text-blue-300" />

            <span>
              {t("directFarmerPortal")}
            </span>

          </div>

          {/* Heading */}

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t("welcomeBuyer")}
          </h1>

          {/* Description */}

          <p className="text-xs sm:text-sm text-blue-200 font-medium max-w-xl">
            {businessName} • {t("buyerBannerDesc")}
          </p>

        </div>

        {/* Post Requirement */}

        <button
          type="button"
          onClick={openRequirements}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs shadow-xl flex items-center gap-2 shrink-0 transition-transform hover:scale-105 cursor-pointer border border-blue-200"
        >

          <PlusCircle className="w-4 h-4 text-blue-600" />

          <span>
            {t("postPurchaseReq")}
          </span>

        </button>

      </div>

      {/* =====================================================
          EMERGENCY BUYER ALERT
      ===================================================== */}

      {emergencyAlert && !dismissedEmergency && (

        <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3 shadow-sm animate-plant-grow">

          {/* Alert Header */}

          <div className="flex items-start justify-between gap-3">

            <div className="flex items-center gap-2.5">

              <div className="p-2 rounded-2xl bg-rose-200 text-rose-900 shrink-0">

                <CloudRain className="w-6 h-6 animate-bounce" />

              </div>

              <div>

                <h3 className="font-extrabold text-sm text-rose-950 flex items-center gap-1.5">

                  <span>
                    {t("emergencyBuyerHeader")}
                  </span>

                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-200 text-rose-900 uppercase">
                    {t("highRisk")}
                  </span>

                </h3>

                <p className="text-xs text-rose-900 font-medium">
                  {t("emergencyBuyerMsg")}
                </p>

              </div>

            </div>

            {/* Dismiss */}

            <button
              type="button"
              onClick={() => setDismissedEmergency(true)}
              className="text-xs font-bold text-rose-800 hover:text-rose-950 underline shrink-0 cursor-pointer"
            >
              {t("dismissAlert")}
            </button>

          </div>

          {/* Alert Footer */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">

            <span className="text-xs font-bold text-rose-900">
              Crops needing immediate buyers:{" "}
              <strong className="text-rose-950">
                Tomato, Wheat, Vegetables
              </strong>
            </span>

            <button
              type="button"
              onClick={openMarketplace}
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs shadow flex items-center gap-1 shrink-0 cursor-pointer"
            >

              <span>
                {t("viewAvailableCrops")}
              </span>

              <ArrowRight className="w-3.5 h-3.5" />

            </button>

          </div>

        </div>

      )}

      {/* =====================================================
          QUICK STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* ===================================================
            ACTIVE REQUIREMENTS
        =================================================== */}

        <button
          type="button"
          onClick={openRequirements}
          className="text-left p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
              {t("activeRequirements")}
            </span>

            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 group-hover:bg-blue-800 group-hover:text-blue-100 flex items-center justify-center transition-colors shadow-2xs">

              <ShoppingBag className="w-5 h-5 text-blue-600 group-hover:text-blue-100" />

            </div>

          </div>

          <div className="flex items-baseline justify-between">

            <span className="text-3xl font-black text-slate-900">
              {safeBuyerRequirements.length}
            </span>

            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              {t("sourcingOpen")}
            </span>

          </div>

        </button>

        {/* ===================================================
            AVAILABLE CROPS
        =================================================== */}

        <button
          type="button"
          onClick={openMarketplace}
          className="text-left p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
              {t("availableCrops")}
            </span>

            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-900 group-hover:bg-[#143601] group-hover:text-[#aad576] flex items-center justify-center transition-colors shadow-2xs">

              <Sparkles className="w-5 h-5 text-[#538d22] group-hover:text-[#aad576]" />

            </div>

          </div>

          <div className="flex items-baseline justify-between">

            <span className="text-3xl font-black text-slate-900">
              {safeCrops.length}
            </span>

            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {t("directFarms")}
            </span>

          </div>

        </button>

        {/* ===================================================
            PENDING OFFERS
        =================================================== */}

        <button
          type="button"
          onClick={openOffers}
          className="text-left p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
              {t("pendingOffers")}
            </span>

            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 group-hover:bg-amber-800 group-hover:text-amber-100 flex items-center justify-center transition-colors shadow-2xs">

              <PlusCircle className="w-5 h-5 text-amber-700 group-hover:text-amber-100" />

            </div>

          </div>

          <div className="flex items-baseline justify-between">

            <span className="text-3xl font-black text-slate-900">
              {safeBuyerOffers.length}
            </span>

            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {t("inNegotiation")}
            </span>

          </div>

        </button>

        {/* ===================================================
            ACTIVE PURCHASES
        =================================================== */}

        <button
          type="button"
          onClick={openTransactions}
          className="text-left p-5 rounded-3xl dashboard-stat-card cursor-pointer space-y-3 group relative overflow-hidden"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
              {t("activePurchases")}
            </span>

            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-900 group-hover:bg-purple-800 group-hover:text-purple-100 flex items-center justify-center transition-colors shadow-2xs">

              <ArrowRight className="w-5 h-5 text-purple-700 group-hover:text-purple-100" />

            </div>

          </div>

          <div className="flex items-baseline justify-between">

            <span className="text-3xl font-black text-slate-900">
              {safeTransactions.length}
            </span>

            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
              {t("dispatched")}
            </span>

          </div>

        </button>

      </div>

      {/* =====================================================
          AVAILABLE PRODUCE
      ===================================================== */}

      <div className="p-6 rounded-3xl bg-white border border-[#e2ebd9] shadow-2xs space-y-4">

        {/* Section Header */}

        <div className="flex items-center justify-between">

          <h3 className="text-base font-extrabold text-[#143601] flex items-center gap-2">

            <ShoppingBag className="w-5 h-5 text-[#538d22]" />

            {t("topAvailableProduce")}

          </h3>

          <button
            type="button"
            onClick={openMarketplace}
            className="text-xs font-extrabold text-[#245501] hover:underline cursor-pointer"
          >
            {t("exploreMarketplace")}
          </button>

        </div>

        {/* ===================================================
            NO CROPS
        =================================================== */}

        {safeCrops.length === 0 && (

          <div className="py-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f4f8f0] flex items-center justify-center">

              <ShoppingBag className="w-8 h-8 text-[#8abf68]" />

            </div>

            <h4 className="mt-4 font-black text-[#143601]">
              No crops available
            </h4>

            <p className="text-sm text-slate-500 mt-1">
              There are currently no crop listings available.
            </p>

            <button
              type="button"
              onClick={openMarketplace}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white text-xs font-extrabold"
            >
              {t("exploreMarketplace")}
            </button>

          </div>

        )}

        {/* ===================================================
            CROP CARDS
        =================================================== */}

        {safeCrops.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {safeCrops.slice(0, 3).map((crop: CropListing) => (

              <div
                key={crop.id}
                className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] space-y-3 flex flex-col justify-between"
              >

                {/* Crop Details */}

                <div className="space-y-2">

                  {/* Image */}

                  <CropImage
                    src={crop.image}
                    cropName={crop.cropName}
                    alt={crop.cropName || "Crop"}
                    className="w-full h-32 rounded-xl object-cover"
                  />

                  {/* Name + Price */}

                  <div className="flex items-center justify-between gap-2">

                    <h4 className="font-black text-sm text-[#143601] truncate">
                      {crop.cropName || "Unknown Crop"}
                    </h4>

                    <span className="text-xs font-black text-[#538d22] whitespace-nowrap">
                      ₹{crop.expectedPrice ?? 0}/Qtl
                    </span>

                  </div>

                  {/* Farmer */}

                  <p className="text-xs text-[#4b633d] font-medium">

                    {crop.farmerName || "Farmer"}

                    {" • "}

                    {crop.quantity ?? 0}{" "}

                    {crop.unit || "Qtl"}

                    {crop.grade
                      ? ` (${crop.grade})`
                      : ""}

                  </p>

                  {/* Location */}

                  {crop.location && (

                    <p className="text-[11px] text-slate-500">
                      📍 {crop.location}
                    </p>

                  )}

                </div>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="flex items-center gap-2 pt-2 border-t border-[#e2ebd9]">

                  {/* View Profile */}

                  <button
                    type="button"
                    onClick={() => viewFarmerProfile(crop)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-[#e2ebd9] text-[#143601] font-extrabold text-xs border border-[#e2ebd9] flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                    title={t("viewProfile")}
                  >

                    <Eye className="w-3.5 h-3.5 text-[#538d22]" />

                    <span>
                      {t("viewProfile")}
                    </span>

                  </button>

                  {/* Make Offer */}

                  <button
                    type="button"
                    onClick={() => makeOffer(crop)}
                    className="flex-1 py-2 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow cursor-pointer text-center"
                  >
                    {t("makeOffer")}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          OFFER MODAL
      ===================================================== */}

      <SendOfferModal
        isOpen={!!selectedCropForOffer}
        onClose={() => setSelectedCropForOffer(null)}
        crop={selectedCropForOffer}
        onSuccess={() => {
          setSelectedCropForOffer(null);
          setActiveTab("buyer-offers");
        }}
      />

      {/* =====================================================
          FARMER PROFILE MODAL
      ===================================================== */}

      <ViewProfileModal
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        profileData={selectedProfile}
      />

    </div>
  );
};

export default BuyerDashboard;