import type { CropListing } from '../types';
import { apiClient } from './apiClient';

const mapCropListing = (c: any): CropListing => ({
  id: String(c.cropListingId || c.id || Math.random()),
  farmerId: String(c.farmerId || '1'),
  farmerName: c.farmerName || 'Local Farmer',
  cropName: c.cropName || 'Crop',
  variety: c.qualityGrade || 'Standard',
  quantity: Number(c.quantity || 0),
  unit: c.unit || 'kg',
  grade: (c.qualityGrade as any) || 'Grade A',
  location: c.location || `${c.district || 'Rajkot'}, ${c.state || 'Gujarat'}`,
  district: c.district || 'Rajkot',
  state: c.state || 'Gujarat',
  pickupLocation: c.location || `${c.district || 'Rajkot'}, ${c.state || 'Gujarat'}`,
  expectedPrice: Number(c.askingPrice || 0),
  currentMarketPrice: Number(c.askingPrice || 0),
  aiFairPriceMin: Math.round(Number(c.askingPrice || 0) * 0.95),
  aiFairPriceMax: Math.round(Number(c.askingPrice || 0) * 1.15),
  status: (c.status as any) || 'Active',
  harvestDate: c.createdAt ? String(c.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
  expectedSellingDate: c.expectedSellingDate ? String(c.expectedSellingDate).split('T')[0] : new Date().toISOString().split('T')[0],
  image: apiClient.resolveImageUrl(c.imageUrl || c.image, c.cropName),
  distanceKm: 15,
  createdAt: c.createdAt ? String(c.createdAt).split('T')[0] : new Date().toISOString().split('T')[0]
});

export const cropService = {
  async getCrops(): Promise<CropListing[]> {
    try {
      const data = await apiClient.get<any[]>('/croplistings');
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapCropListing);
      }
    } catch (e) {
      console.warn('cropService.getCrops backend error:', e);
    }
    return [];
  },

  async getCropById(id: string): Promise<CropListing | null> {
    try {
      const data = await apiClient.get<any>(`/croplistings/${id}`);
      if (data) return mapCropListing(data);
    } catch (e) {
      console.warn('cropService.getCropById backend error:', e);
    }
    const crops = await this.getCrops();
    return crops.find((c) => c.id === id) || null;
  },

  async createCrop(cropData: Omit<CropListing, 'id' | 'createdAt'>, imageFile?: File | null): Promise<CropListing> {
    try {
      const cropNameToId: Record<string, number> = {
        tomato: 1,
        wheat: 2,
        onion: 3,
        cotton: 4,
        potato: 5,
        chilli: 6,
        chili: 6,
        cabbage: 7,
        brinjal: 8,
        eggplant: 8,
        groundnut: 9,
        peanut: 9,
        soybean: 10,
        soya: 10
      };
      const normalizedName = (cropData.cropName || '').toLowerCase().trim();
      let matchedCropId = 1;
      for (const [key, id] of Object.entries(cropNameToId)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
          matchedCropId = id;
          break;
        }
      }

      const formData = new FormData();
      formData.append('CropId', String(matchedCropId));
      formData.append('Quantity', String(cropData.quantity));
      formData.append('Unit', cropData.unit || 'kg');
      formData.append('QualityGrade', cropData.grade || 'Grade A');
      formData.append('Location', cropData.location || 'Rajkot');
      formData.append('District', cropData.district || 'Rajkot');
      formData.append('State', cropData.state || 'Gujarat');
      formData.append('AskingPrice', String(cropData.expectedPrice));
      formData.append('ExpectedSellingDate', cropData.expectedSellingDate || new Date().toISOString());

      if (imageFile) {
        formData.append('Image', imageFile);
      }

      const res = await apiClient.uploadFormData<any>('/croplistings', formData);
      return mapCropListing(res);
    } catch (e) {
      console.warn('cropService.createCrop backend error:', e);
      return {
        ...cropData,
        id: `crop-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
    }
  },

  async updateCrop(id: string, updates: Partial<CropListing>): Promise<CropListing | null> {
    try {
      const res = await apiClient.put<any>(`/croplistings/${id}`, updates);
      if (res) return mapCropListing(res);
    } catch (e) {
      console.warn('cropService.updateCrop backend error:', e);
    }
    return null;
  },

  async deleteCrop(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/croplistings/${id}`);
      return true;
    } catch (e) {
      console.warn('cropService.deleteCrop backend error:', e);
      return false;
    }
  },

  async uploadCropImage(id: string, imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await apiClient.uploadFormData<any>(`/croplistings/${id}/image`, formData);
    return apiClient.resolveImageUrl(res?.imageUrl || res?.image);
  }
};
