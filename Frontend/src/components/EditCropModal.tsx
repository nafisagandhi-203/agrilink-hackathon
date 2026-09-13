import React, { useState, useRef } from 'react';
import { X, Sprout, Upload, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import type { CropListing } from '../types';
import { CropImage } from './CropImage';

interface EditCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: CropListing | null;
  onSuccess?: () => void;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const EditCropModal: React.FC<EditCropModalProps> = ({
  isOpen,
  onClose,
  crop,
  onSuccess
}) => {
  const { updateCrop, uploadCropImage } = useData();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [quantity, setQuantity] = useState<string>(crop ? String(crop.quantity) : '');
  const [unit, setUnit] = useState<string>(crop?.unit || 'kg');
  const [grade, setGrade] = useState<string>(crop?.grade || 'Grade A');
  const [expectedPrice, setExpectedPrice] = useState<string>(crop ? String(crop.expectedPrice) : '');
  const [location, setLocation] = useState<string>(crop?.location || '');
  const [status, setStatus] = useState<string>(crop?.status || 'Active');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state when crop changes
  React.useEffect(() => {
    if (crop) {
      setQuantity(String(crop.quantity));
      setUnit(crop.unit);
      setGrade(crop.grade);
      setExpectedPrice(String(crop.expectedPrice));
      setLocation(crop.location);
      setStatus(crop.status);
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileError(null);
      setSuccessMessage(null);
    }
  }, [crop]);

  if (!isOpen || !crop) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFileError('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setFileError('File size exceeds 5MB limit. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setFileError(null);

      // If new image selected, upload it first via POST /api/CropListings/{id}/image
      if (selectedFile) {
        await uploadCropImage(crop.id, selectedFile);
      }

      // Update remaining crop metadata
      await updateCrop(crop.id, {
        quantity: Number(quantity),
        unit,
        grade: grade as any,
        expectedPrice: Number(expectedPrice),
        location,
        status: status as any
      });

      setSuccessMessage('Listing updated successfully!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setFileError(err?.message || 'Failed to update crop listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#F3F7E8] border-b border-[#DCE4D3] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#5F8D4E] text-white flex items-center justify-center font-black shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#263322]">Edit Crop: {crop.cropName}</h3>
              <p className="text-[10px] font-bold text-[#5F8D4E] uppercase tracking-wider">
                Update Produce Specs & Image
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-[#DCE4D3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Crop Image & Replacement Section */}
          <div className="space-y-2">
            <label className="font-bold text-[#143601] uppercase tracking-wider block">
              Crop Image
            </label>
            
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#e2ebd9] shrink-0 bg-[#f4f8f0]">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <CropImage src={crop.image} cropName={crop.cropName} alt={crop.cropName} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="edit-crop-image-input"
                />
                <label
                  htmlFor="edit-crop-image-input"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-bold cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{previewUrl ? 'Change Image' : 'Replace Image'}</span>
                </label>
                <p className="text-[10px] text-[#4b633d]">
                  JPG, PNG, or WebP (max 5 MB).
                </p>
              </div>
            </div>

            {fileError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="font-bold text-[#143601] block mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#143601] block mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="quintal">Quintals (100 kg)</option>
                <option value="ton">Metric Tons</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#143601] block mb-1">Quality Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              >
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#143601] block mb-1">Expected Price (₹/Qtl)</label>
              <input
                type="number"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="font-bold text-[#143601] block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="font-bold text-[#143601] block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebd9] bg-[#f4f8f0] text-[#143601] font-bold focus:ring-2 focus:ring-[#538d22] focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Under Negotiation">Under Negotiation</option>
                <option value="Sold">Sold</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#f4f8f0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
