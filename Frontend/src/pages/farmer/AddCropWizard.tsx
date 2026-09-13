import React, { useState, useRef } from 'react';
import { Sprout, MapPin, DollarSign, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Upload, AlertCircle, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { getCropDefaultImage } from '../../services/apiClient';

interface AddCropWizardProps {
  setActiveTab: (tab: string) => void;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const AddCropWizard: React.FC<AddCropWizardProps> = ({ setActiveTab }) => {
  const { addCrop } = useData();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Hybrid-314');
  const [quantity, setQuantity] = useState('500');
  const [unit, setUnit] = useState('kg');
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Grade C' | 'Premium'>('Grade A');

  const [farmLocation, setFarmLocation] = useState('Rajkot, Gujarat');
  const [district, setDistrict] = useState('Rajkot');
  const [state, setState] = useState('Gujarat');
  const [pickupLocation, setPickupLocation] = useState('Farm Gate #42, Gondal Highway, Rajkot');

  const [expectedSellingDate, setExpectedSellingDate] = useState('2026-09-15');
  const [expectedPrice, setExpectedPrice] = useState('2500');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Invalid image type. Only JPG, PNG, and WebP files are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('File size exceeds the 5MB maximum limit. Please select a smaller photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const validateStep = (step: number) => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!cropName) errs.cropName = 'Crop name is required';
      if (!quantity || Number(quantity) <= 0) errs.quantity = 'Enter valid quantity';
    }
    if (step === 2) {
      if (!farmLocation) errs.farmLocation = 'Farm location is required';
      if (!pickupLocation) errs.pickupLocation = 'Pickup location address is required';
    }
    if (step === 3) {
      if (!expectedPrice || Number(expectedPrice) <= 0) errs.expectedPrice = 'Enter minimum expected price';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    setImageError(null);

    try {
      await addCrop({
        farmerId: user?.id || 'usr-farmer-1',
        farmerName: user?.name || 'Ramesh Patel',
        cropName,
        variety,
        quantity: Number(quantity),
        unit,
        grade,
        location: farmLocation,
        district,
        state,
        pickupLocation,
        expectedPrice: Number(expectedPrice),
        currentMarketPrice: Number(expectedPrice) || 2450,
        aiFairPriceMin: Math.round((Number(expectedPrice) || 2500) * 0.95),
        aiFairPriceMax: Math.round((Number(expectedPrice) || 2500) * 1.05),
        status: 'Active',
        harvestDate: new Date().toISOString().split('T')[0],
        expectedSellingDate,
        image: imagePreview || getCropDefaultImage(cropName),
        distanceKm: 28
      }, imageFile);

      setActiveTab('farmer-listings');
    } catch (err: any) {
      setImageError(err?.message || 'Failed to upload crop listing. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-plant-grow">
      
      <div className="text-center space-y-2">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#f4f8f0] text-[#143601] border border-[#e2ebd9]">
          🌾 Create New Crop Listing
        </span>
        <h1 className="text-3xl font-black text-[#143601]">Add Crop to Marketplace</h1>
        <p className="text-xs text-[#4b633d] font-medium">Fill in the multi-step details to connect with AI price intelligence and top buyers.</p>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#e2ebd9] shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { num: 1, title: 'Crop Info' },
            { num: 2, title: 'Farm Location' },
            { num: 3, title: 'Pricing & Date' },
            { num: 4, title: 'Review & Publish' }
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mb-1.5 transition-all ${
                    isDone
                      ? 'bg-[#143601] text-white'
                      : isActive
                      ? 'bg-[#538d22] text-white ring-4 ring-[#538d22]/20 scale-105'
                      : 'bg-[#f4f8f0] text-[#4b633d] border border-[#e2ebd9]'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:inline ${
                    isActive ? 'text-[#143601] font-black' : 'text-[#4b633d]'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2ebd9] shadow-xl space-y-6">
        
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-black text-[#143601] flex items-center gap-2 border-b border-[#f4f8f0] pb-3">
              <Sprout className="w-5 h-5 text-[#538d22]" /> Step 1: Crop Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Crop Name</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                >
                  <option value="Tomato">🍅 Tomato</option>
                  <option value="Wheat">🌾 Wheat</option>
                  <option value="Onion">🧅 Onion</option>
                  <option value="Potato">🥔 Potato</option>
                  <option value="Cotton">🌱 Cotton</option>
                  <option value="Groundnut">🥜 Groundnut</option>
                  <option value="Rice">🍚 Rice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Variety</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Hybrid-314, Sharbati"
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
                {errors.quantity && <p className="text-xs text-rose-500 font-bold mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="quintal">Quintals (100 kg)</option>
                  <option value="ton">Metric Tons</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Quality Grade</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['Grade A', 'Grade B', 'Grade C', 'Premium'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                        grade === g
                          ? 'bg-[#143601] text-white border-[#538d22] shadow font-black'
                          : 'border-[#e2ebd9] bg-[#f4f8f0] text-[#4b633d] hover:bg-[#e2ebd9]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block">
                  Crop Image (Optional)
                </label>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e2ebd9]">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f4f8f0] border border-[#e2ebd9] shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Crop Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Sprout className="w-8 h-8 text-[#538d22]/40" />
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 text-xs">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="crop-image-upload-input"
                    />
                    <label
                      htmlFor="crop-image-upload-input"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-bold cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imagePreview ? 'Change Photo' : 'Upload Crop Photo'}</span>
                    </label>
                    <p className="text-[11px] text-[#4b633d]">
                      JPEG, PNG, or WebP up to 5 MB.
                    </p>
                  </div>
                </div>

                {imageError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{imageError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-black text-[#143601] flex items-center gap-2 border-b border-[#f4f8f0] pb-3">
              <MapPin className="w-5 h-5 text-[#538d22]" /> Step 2: Farm & Pickup Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Farm Location / Village</label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Exact Pickup Location for Transporters</label>
                <textarea
                  rows={2}
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-black text-[#143601] flex items-center gap-2 border-b border-[#f4f8f0] pb-3">
              <DollarSign className="w-5 h-5 text-[#538d22]" /> Step 3: Selling & Pricing Expectation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Expected Selling Date</label>
                <input
                  type="date"
                  value={expectedSellingDate}
                  onChange={(e) => setExpectedSellingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-extrabold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#143601] uppercase tracking-wider block mb-1">Minimum Expected Price (₹ per quintal)</label>
                <input
                  type="number"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] text-xs font-black focus:ring-2 focus:ring-[#538d22] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9] flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#538d22] shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold text-[#143601] block">AI Market Price Insight for {cropName}:</span>
                <span className="text-[#4b633d] font-semibold leading-relaxed">
                  Current APMC price is ₹2,450/q. AI Fair Price range is estimated at ₹2,400 - ₹2,600 per quintal.
                </span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-black text-[#143601] flex items-center gap-2 border-b border-[#f4f8f0] pb-3">
              <CheckCircle2 className="w-5 h-5 text-[#538d22]" /> Step 4: Final Preview Card
            </h3>

            <div className="p-6 rounded-3xl bg-[#f4f8f0] border border-[#e2ebd9] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-[#e2ebd9] shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🍅</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#143601]">{cropName} ({variety})</h4>
                    <p className="text-xs text-[#4b633d] font-semibold">{farmLocation} • {grade}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#143601] text-[#aad576]">
                  Ready to Publish
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#e2ebd9] text-xs">
                <div>
                  <span className="text-[#4b633d] font-bold block uppercase text-[10px]">Total Quantity</span>
                  <span className="font-extrabold text-[#143601]">{quantity} {unit}</span>
                </div>
                <div>
                  <span className="text-[#4b633d] font-bold block uppercase text-[10px]">Expected Price</span>
                  <span className="font-black text-[#538d22]">₹{expectedPrice} / q</span>
                </div>
                <div>
                  <span className="text-[#4b633d] font-bold block uppercase text-[10px]">AI Fair Estimate</span>
                  <span className="font-bold text-[#245501]">₹2.4k - ₹2.6k</span>
                </div>
                <div>
                  <span className="text-[#4b633d] font-bold block uppercase text-[10px]">Selling Date</span>
                  <span className="font-extrabold text-[#143601]">{expectedSellingDate}</span>
                </div>
              </div>
            </div>

            {imageError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full py-4 px-6 rounded-2xl bg-[#143601] hover:bg-[#1a4301] text-white font-black text-base shadow-xl shadow-[#143601]/20 transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#aad576]" />
                  <span>Publishing Listing & Uploading Photo...</span>
                </>
              ) : (
                <>
                  <span>Publish Crop Listing</span>
                  <CheckCircle2 className="w-5 h-5 text-[#aad576]" />
                </>
              )}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-[#f4f8f0]">
          {currentStep > 1 ? (
            <button
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-[#538d22]" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 4 && (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 ml-auto"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4 text-[#aad576]" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
