import type { CropListing } from '../types';
import { mockCrops } from '../data/mockData';
import { apiClient } from './apiClient';

export const cropService = {
  async getCrops(): Promise<CropListing[]> {
    // Attempt real backend fetch
    const remoteCrops = await apiClient.get<any[]>('/crops');
    if (remoteCrops && Array.isArray(remoteCrops) && remoteCrops.length > 0) {
      const mapped: CropListing[] = remoteCrops.map((c: any, index: number) => ({
        id: c.cropId ? `crop-${c.cropId}` : `crop-rem-${index}`,
        farmerId: c.farmerId ? `usr-${c.farmerId}` : 'usr-farmer-1',
        farmerName: c.farmerName || 'Verified Farmer',
        cropName: c.cropName || 'Produce',
        variety: c.variety || 'Standard',
        quantity: c.quantity || 100,
        unit: c.unit || 'quintal',
        grade: (c.grade as any) || 'Grade A',
        location: c.location || 'Rajkot, Gujarat',
        district: c.district || 'Rajkot',
        state: c.state || 'Gujarat',
        pickupLocation: c.pickupLocation || 'Farm Gate, Rajkot',
        expectedPrice: c.pricePerUnit || c.expectedPrice || 2500,
        currentMarketPrice: c.currentMarketPrice || c.pricePerUnit || 2400,
        aiFairPriceMin: c.aiFairPriceMin || 2300,
        aiFairPriceMax: c.aiFairPriceMax || 2700,
        status: (c.status as any) || 'Active',
        harvestDate: c.harvestDate || new Date().toISOString().split('T')[0],
        expectedSellingDate: c.expectedSellingDate || new Date().toISOString().split('T')[0],
        image: c.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
        distanceKm: c.distanceKm || 12,
        createdAt: c.createdAt || new Date().toISOString().split('T')[0]
      }));
      localStorage.setItem('agripulse_crops', JSON.stringify(mapped));
      return mapped;
    }

    const saved = localStorage.getItem('agripulse_crops');
    return saved ? JSON.parse(saved) : mockCrops;
  },

  async getCropById(id: string): Promise<CropListing | null> {
    const crops = await this.getCrops();
    return crops.find((c) => c.id === id) || null;
  },

  async createCrop(cropData: Omit<CropListing, 'id' | 'createdAt'>): Promise<CropListing> {
    const newCrop: CropListing = {
      ...cropData,
      id: `crop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Synchronize to backend Web API
    apiClient.post('/crops', {
      cropName: newCrop.cropName,
      commodityGroup: 'Grains',
      description: `${newCrop.variety} - ${newCrop.grade}`,
      isActive: true
    }).catch((err) => {
      console.info('Backend crop sync background notification:', err);
    });

    const crops = await this.getCrops();
    const updated = [newCrop, ...crops];
    localStorage.setItem('agripulse_crops', JSON.stringify(updated));
    return newCrop;
  },

  async updateCrop(id: string, updates: Partial<CropListing>): Promise<CropListing | null> {
    const numericId = parseInt(id.replace('crop-', ''), 10);
    if (!isNaN(numericId)) {
      apiClient.put(`/crops/${numericId}`, {
        cropId: numericId,
        cropName: updates.cropName,
        commodityGroup: 'Grains',
        description: updates.variety,
        isActive: updates.status === 'Active'
      }).catch(() => {});
    }

    const crops = await this.getCrops();
    let updatedCrop: CropListing | null = null;
    const updatedList = crops.map((c) => {
      if (c.id === id) {
        updatedCrop = { ...c, ...updates };
        return updatedCrop;
      }
      return c;
    });
    localStorage.setItem('agripulse_crops', JSON.stringify(updatedList));
    return updatedCrop;
  },

  async deleteCrop(id: string): Promise<boolean> {
    const numericId = parseInt(id.replace('crop-', ''), 10);
    if (!isNaN(numericId)) {
      apiClient.delete(`/crops/${numericId}`).catch(() => {});
    }

    const crops = await this.getCrops();
    const filtered = crops.filter((c) => c.id !== id);
    localStorage.setItem('agripulse_crops', JSON.stringify(filtered));
    return true;
  }
};
