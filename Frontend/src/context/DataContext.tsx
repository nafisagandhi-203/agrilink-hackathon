import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  CropListing,
  BuyerRequirement,
  BuyerOffer,
  ChatMessage,
  Transaction,
  TransportBooking,
  AbnormalPriceAlert,
  Notification,
  User,
  MarketPriceItem
} from '../types';
import { apiClient, resolveImageUrl } from '../services/apiClient';
import { cropService } from '../services/cropService';

interface DataContextType {
  crops: CropListing[];
  buyerRequirements: BuyerRequirement[];
  buyerOffers: BuyerOffer[];
  chatMessages: Record<string, ChatMessage[]>;
  transactions: Transaction[];
  transportBookings: TransportBooking[];
  alerts: AbnormalPriceAlert[];
  notifications: Notification[];
  usersList: User[];
  marketPrices: MarketPriceItem[];
  isLoading: boolean;
  refreshData: () => Promise<void>;

  addCrop: (crop: Omit<CropListing, 'id' | 'createdAt'>, imageFile?: File | null) => Promise<CropListing>;
  updateCrop: (id: string, updates: Partial<CropListing>) => Promise<void>;
  uploadCropImage: (cropId: string, imageFile: File) => Promise<string>;
  deleteCrop: (id: string) => Promise<void>;
  addRequirement: (req: Omit<BuyerRequirement, 'id' | 'createdAt'>) => Promise<void>;
  sendOffer: (offer: Omit<BuyerOffer, 'id' | 'createdAt'>) => Promise<void>;
  updateOfferStatus: (offerId: string, status: BuyerOffer['status']) => Promise<void>;
  sendChatMessage: (buyerId: string, message: Omit<ChatMessage, 'id'>) => void;
  createTransactionFromOffer: (
    offer: BuyerOffer,
    farmerPhone: string,
    farmerLocation: string,
    buyerPhone: string,
    buyerLocation: string
  ) => Promise<Transaction>;
  bookTransport: (booking: Omit<TransportBooking, 'id' | 'bookingDate'>) => Promise<TransportBooking>;
  updateTransportStatus: (bookingId: string, status: TransportBooking['status']) => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  toggleUserVerification: (userId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops, setCrops] = useState<CropListing[]>([]);
  const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>([]);
  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('agripulse_chat');
    return saved ? JSON.parse(saved) : {};
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transportBookings, setTransportBookings] = useState<TransportBooking[]>([]);
  const [alerts, setAlerts] = useState<AbnormalPriceAlert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('agripulse_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

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
    image: resolveImageUrl(c.imageUrl || c.image, c.cropName),
    distanceKm: 15,
    createdAt: c.createdAt ? String(c.createdAt).split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const mapBuyerRequirement = (r: any): BuyerRequirement => ({
    id: String(r.buyerRequirementId || r.id || Math.random()),
    buyerId: String(r.buyerId || '1'),
    buyerName: r.buyerName || 'Verified Buyer',
    verified: true,
    cropName: r.cropName || 'Tomato',
    quantity: Number(r.requiredQuantity || r.quantity || 0),
    unit: 'kg',
    grade: r.qualityGrade || 'Grade A',
    preferredLocation: r.location || 'Gujarat',
    offeredPrice: Number(r.offeredPrice || 0),
    purchaseDate: r.purchaseDate ? String(r.purchaseDate).split('T')[0] : new Date().toISOString().split('T')[0],
    deliveryRequirement: 'Direct Mandi / Farm Pickup',
    status: (r.status as any) || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  });

  const mapOffer = (o: any): BuyerOffer => ({
    id: String(o.offerId || o.id || Math.random()),
    cropListingId: String(o.cropListingId || ''),
    cropName: o.cropName || 'Crop',
    buyerId: String(o.buyerId || ''),
    buyerName: o.buyerName || 'Buyer',
    buyerVerified: true,
    offeredPrice: Number(o.offeredPrice || 0),
    quantity: Number(o.quantity || 0),
    unit: 'kg',
    totalAmount: Number(o.quantity || 0) * Number(o.offeredPrice || 0),
    deliveryDate: o.deliveryDate ? String(o.deliveryDate).split('T')[0] : new Date().toISOString().split('T')[0],
    compatibilityScore: Number(o.compatibilityScore || 92),
    distanceKm: Number(o.distanceKm || 18),
    purchaseDate: o.createdAt ? String(o.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
    gradeRequirement: o.gradeRequirement || 'Grade A',
    status: (o.status as any) || 'Pending',
    createdAt: o.createdAt ? String(o.createdAt).replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  const mapTransaction = (t: any): Transaction => ({
    id: String(t.transactionId || t.id || Math.random()),
    receiptNo: `AP-${new Date().getFullYear()}-${t.transactionId || Math.floor(1000 + Math.random() * 9000)}`,
    cropListingId: String(t.cropListingId || ''),
    cropName: t.cropName || 'Produce',
    farmerId: String(t.farmerId || ''),
    farmerName: t.farmerName || 'Farmer',
    farmerPhone: '+91 98765 43210',
    farmerLocation: 'Rajkot, Gujarat',
    buyerId: String(t.buyerId || ''),
    buyerName: t.buyerName || 'Buyer',
    buyerPhone: '+91 98250 12345',
    buyerLocation: 'Ahmedabad, Gujarat',
    quantity: Number(t.quantity || 0),
    unit: 'kg',
    agreedPrice: Number(t.agreedPrice || 0),
    totalAmount: Number(t.totalAmount || 0),
    purchaseDate: t.createdAt ? String(t.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
    deliveryStatus: (t.transactionStatus as any) || 'Deal Confirmed',
    createdAt: t.createdAt ? String(t.createdAt).split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const mapTransportBooking = (b: any): TransportBooking => ({
    id: String(b.transportBookingId || b.id || Math.random()),
    transactionId: String(b.transactionId || ''),
    farmerName: b.farmerName || 'Farmer',
    farmerPhone: b.farmerPhone || '+91 98765 43210',
    pickupLocation: b.pickupLocation || 'Farm Gate',
    buyerName: b.buyerName || 'Buyer',
    buyerPhone: b.buyerPhone || '+91 98250 12345',
    deliveryLocation: b.deliveryLocation || 'Market Mandi',
    cropName: b.cropName || 'Farm Produce',
    quantityKg: Number(b.cropQuantity || b.quantityKg || 0),
    distanceKm: Number(b.distanceKm || 50),
    estimatedCost: Number(b.estimatedTransportCost || b.agreedTransportCost || 2500),
    transporterId: String(b.transportProviderId || ''),
    transporterName: b.transportProviderName || 'Transport Provider',
    driverName: b.driverName || 'Ramdas Patel',
    driverPhone: b.driverPhone || '+91 99887 76655',
    vehicleNumber: b.vehicleNumber || 'GJ-03-XX-0000',
    vehicleType: b.vehicleType || 'Tata 407',
    status: (b.bookingStatus as any) || 'Booking Confirmed',
    eta: b.eta || '4 Hours',
    bookingDate: b.requestedAt ? String(b.requestedAt).replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16),
    timeline: [
      { status: 'Booked', done: true, timestamp: '10:00 AM' },
      { status: 'Assigned', done: true, timestamp: '10:30 AM' },
      { status: 'Pickup Completed', done: b.bookingStatus === 'In Transit' || b.bookingStatus === 'Delivered', timestamp: '01:00 PM' },
      { status: 'In Transit', done: b.bookingStatus === 'In Transit' || b.bookingStatus === 'Delivered', timestamp: '02:30 PM' },
      { status: 'Delivered', done: b.bookingStatus === 'Delivered', timestamp: '05:00 PM' }
    ]
  });

  const mapNotification = (n: any): Notification => ({
    id: String(n.notificationId || n.id || Math.random()),
    userId: String(n.userId || ''),
    role: 'farmer',
    title: n.title || 'Notification',
    message: n.message || '',
    type: 'system',
    date: n.createdAt ? String(n.createdAt).split('T')[0] : 'Today',
    read: Boolean(n.isRead),
    link: '/farmer/dashboard'
  });

  const mapAlert = (a: any): AbnormalPriceAlert => ({
    id: String(a.alertId || a.id || Math.random()),
    cropName: a.cropName || 'Produce',
    buyerId: String(a.buyerId || ''),
    buyerName: a.buyerName || 'Buyer',
    offeredPrice: Number(a.offeredPrice || 0),
    fairPriceMin: Number(a.fairPriceMin || (a.expectedPrice ? a.expectedPrice * 0.9 : 25)),
    fairPriceMax: Number(a.fairPriceMax || (a.expectedPrice ? a.expectedPrice * 1.1 : 35)),
    differencePercent: Math.abs(Number(a.differencePercent || a.differencePercentage || 25)),
    severity: (Math.abs(Number(a.differencePercent || a.differencePercentage || 0)) > 30 ? 'High' : 'Medium') as 'Low' | 'Medium' | 'High',
    status: (a.isRead ? 'Dismissed' : 'Pending') as 'Pending' | 'Dismissed' | 'Investigating',
    date: a.createdAt ? String(a.createdAt).split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const mapUser = (u: any): User => ({
    id: String(u.userId || u.id || Math.random()),
    name: u.fullName || 'User',
    email: u.email || '',
    phone: u.phoneNumber || '',
    role: (u.role?.name?.toLowerCase() || (u.roleId === 1 ? 'farmer' : u.roleId === 2 ? 'buyer' : 'admin')) as any,
    verified: Boolean(u.isVerified),
    location: 'Gujarat, India',
    avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'User')}&background=538d22&color=fff&bold=true&size=128`,
    joinedDate: u.createdAt ? String(u.createdAt).split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const mapMarketPrice = (m: any): MarketPriceItem => ({
    id: Number(m.marketPriceId || m.id || Math.random()),
    cropName: m.cropName || 'Produce',
    mandi: m.marketName || m.location || 'APMC Mandi',
    state: m.state || 'Gujarat',
    modalPrice: Number(m.modalPrice || 0),
    minPrice: Number(m.minPrice || 0),
    maxPrice: Number(m.maxPrice || 0),
    trend: (m.modalPrice >= 2400 ? 'up' : m.modalPrice < 1900 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
    priceDate: m.priceDate ? String(m.priceDate).split('T')[0] : 'Today'
  });

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Public / Core listings, requirements, market prices, and directory users
      const rawCrops = await apiClient.get<any[]>('/croplistings').catch(() => []);
      if (Array.isArray(rawCrops)) {
        setCrops(rawCrops.map(mapCropListing));
      }

      const rawRequirements = await apiClient.get<any[]>('/buyerrequirements').catch(() => []);
      if (Array.isArray(rawRequirements)) {
        setBuyerRequirements(rawRequirements.map(mapBuyerRequirement));
      }

      const rawPrices = await apiClient.get<any[]>('/marketprices').catch(() => []);
      if (Array.isArray(rawPrices)) {
        setMarketPrices(rawPrices.map(mapMarketPrice));
      }

      const rawUsers = await apiClient.get<any[]>('/users').catch(() => []);
      if (Array.isArray(rawUsers)) {
        setUsersList(rawUsers.map(mapUser));
      }

      // 2. Fetch User-specific entities (offers, transactions, bookings, alerts, notifications)
      if (apiClient.getToken()) {
        const rawOffers = await apiClient.get<any[]>('/offers').catch(() => []);
        if (Array.isArray(rawOffers)) {
          setBuyerOffers(rawOffers.map(mapOffer));
        }

        const rawTransactions = await apiClient.get<any[]>('/transactions').catch(() => []);
        if (Array.isArray(rawTransactions)) {
          setTransactions(rawTransactions.map(mapTransaction));
        }

        const rawTransport = await apiClient.get<any[]>('/transportbookings').catch(() => []);
        if (Array.isArray(rawTransport)) {
          setTransportBookings(rawTransport.map(mapTransportBooking));
        }

        const rawAlerts = await apiClient.get<any[]>('/abnormalpricealerts').catch(() => []);
        if (Array.isArray(rawAlerts)) {
          setAlerts(rawAlerts.map(mapAlert));
        }

        const rawNotifications = await apiClient.get<any[]>('/notifications').catch(() => []);
        if (Array.isArray(rawNotifications)) {
          setNotifications(rawNotifications.map(mapNotification));
        }
      }
    } catch (err) {
      console.warn('Error refreshing live data from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addCrop = async (newCropData: Omit<CropListing, 'id' | 'createdAt'>, imageFile?: File | null): Promise<CropListing> => {
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
      const normalizedName = (newCropData.cropName || '').toLowerCase().trim();
      let matchedCropId = 1;
      for (const [key, id] of Object.entries(cropNameToId)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
          matchedCropId = id;
          break;
        }
      }

      const formData = new FormData();
      formData.append('CropId', String(matchedCropId));
      formData.append('Quantity', String(newCropData.quantity));
      formData.append('Unit', newCropData.unit || 'kg');
      formData.append('QualityGrade', newCropData.grade || 'Grade A');
      formData.append('Location', newCropData.location || newCropData.pickupLocation || 'Rajkot');
      formData.append('District', newCropData.district || 'Rajkot');
      formData.append('State', newCropData.state || 'Gujarat');
      formData.append('AskingPrice', String(newCropData.expectedPrice));
      formData.append('ExpectedSellingDate', newCropData.expectedSellingDate || new Date().toISOString());

      if (imageFile) {
        formData.append('Image', imageFile);
      }

      const created = await apiClient.uploadFormData<any>('/croplistings', formData);
      const mapped = mapCropListing(created);
      setCrops((prev) => [mapped, ...prev]);
      return mapped;
    } catch (err) {
      console.warn('Backend addCrop failed, adding locally:', err);
      const fallback: CropListing = {
        ...newCropData,
        id: `crop-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCrops((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateCrop = async (id: string, updates: Partial<CropListing>) => {
    try {
      await apiClient.put(`/croplistings/${id}`, updates).catch(() => {});
    } catch (e) {
      console.warn('Backend updateCrop error:', e);
    }
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const uploadCropImage = async (id: string, imageFile: File): Promise<string> => {
    try {
      const newImageUrl = await cropService.uploadCropImage(id, imageFile);
      setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, image: newImageUrl } : c)));
      return newImageUrl;
    } catch (e) {
      console.warn('Backend uploadCropImage error:', e);
      throw e;
    }
  };

  const deleteCrop = async (id: string) => {
    try {
      await apiClient.delete(`/croplistings/${id}`).catch(() => {});
    } catch (e) {
      console.warn('Backend deleteCrop error:', e);
    }
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  const addRequirement = async (reqData: Omit<BuyerRequirement, 'id' | 'createdAt'>) => {
    try {
      const payload = {
        cropId: 1,
        requiredQuantity: reqData.quantity,
        qualityGrade: reqData.grade || 'Grade A',
        location: reqData.preferredLocation || 'Gujarat',
        offeredPrice: reqData.offeredPrice,
        purchaseDate: reqData.purchaseDate || new Date().toISOString()
      };
      const res = await apiClient.post<any>('/buyerrequirements', payload).catch(() => null);
      if (res) {
        setBuyerRequirements((prev) => [mapBuyerRequirement(res), ...prev]);
        return;
      }
    } catch (e) {
      console.warn('Backend addRequirement error:', e);
    }
    const fallback: BuyerRequirement = {
      ...reqData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBuyerRequirements((prev) => [fallback, ...prev]);
  };

  const sendOffer = async (offerData: Omit<BuyerOffer, 'id' | 'createdAt'>) => {
    try {
      const payload = {
        cropListingId: Number(offerData.cropListingId) || 1,
        quantity: offerData.quantity,
        offeredPrice: offerData.offeredPrice,
        deliveryDate: offerData.deliveryDate || new Date().toISOString(),
        deliveryConditions: 'Direct transport'
      };
      const res = await apiClient.post<any>('/offers', payload).catch(() => null);
      if (res) {
        setBuyerOffers((prev) => [mapOffer(res), ...prev]);
        return;
      }
    } catch (e) {
      console.warn('Backend sendOffer error:', e);
    }
    const fallback: BuyerOffer = {
      ...offerData,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setBuyerOffers((prev) => [fallback, ...prev]);
  };

  const updateOfferStatus = async (offerId: string, status: BuyerOffer['status']) => {
    try {
      await apiClient.put(`/offers/${offerId}/status`, { status }).catch(() => {});
    } catch (e) {
      console.warn('Backend updateOfferStatus error:', e);
    }
    setBuyerOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status } : o)));
  };

  const sendChatMessage = (buyerId: string, message: Omit<ChatMessage, 'id'>) => {
    const newMsg: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`
    };
    setChatMessages((prev) => ({
      ...prev,
      [buyerId]: [...(prev[buyerId] || []), newMsg]
    }));
  };

  const createTransactionFromOffer = async (
    offer: BuyerOffer,
    farmerPhone: string,
    farmerLocation: string,
    buyerPhone: string,
    buyerLocation: string
  ): Promise<Transaction> => {
    try {
      const payload = { offerId: Number(offer.id) || 1 };
      const res = await apiClient.post<any>('/transactions', payload).catch(() => null);
      if (res) {
        const mapped = mapTransaction(res);
        setTransactions((prev) => [mapped, ...prev]);
        updateCrop(offer.cropListingId, { status: 'Sold' });
        updateOfferStatus(offer.id, 'Accepted');
        return mapped;
      }
    } catch (e) {
      console.warn('Backend createTransaction error:', e);
    }

    const targetCrop = crops.find((c) => c.id === offer.cropListingId);
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      receiptNo: `AP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      cropListingId: offer.cropListingId,
      cropName: offer.cropName,
      farmerId: targetCrop?.farmerId || '1',
      farmerName: targetCrop?.farmerName || 'Ramesh Patel',
      farmerPhone,
      farmerLocation,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerPhone,
      buyerLocation,
      quantity: offer.quantity,
      unit: offer.unit,
      agreedPrice: offer.offeredPrice,
      totalAmount: offer.totalAmount,
      purchaseDate: new Date().toISOString().split('T')[0],
      deliveryStatus: 'Deal Confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTransactions((prev) => [tx, ...prev]);
    updateCrop(offer.cropListingId, { status: 'Sold' });
    updateOfferStatus(offer.id, 'Accepted');
    return tx;
  };

  const bookTransport = async (bookingData: Omit<TransportBooking, 'id' | 'bookingDate'>): Promise<TransportBooking> => {
    try {
      const payload = {
        transactionId: Number(bookingData.transactionId) || 1,
        transportProviderId: Number(bookingData.transporterId) || 1,
        pickupLocation: bookingData.pickupLocation || 'Farm Gate',
        pickupLatitude: 22.3039,
        pickupLongitude: 70.8022,
        deliveryLocation: bookingData.deliveryLocation || 'Market Hub',
        deliveryLatitude: 23.0225,
        deliveryLongitude: 72.5714,
        cropQuantity: bookingData.quantityKg || 1000,
        distanceKm: bookingData.distanceKm || 50,
        estimatedTravelTimeMinutes: 120,
        estimatedTransportCost: bookingData.estimatedCost || 2500,
        agreedTransportCost: bookingData.estimatedCost || 2500
      };
      const res = await apiClient.post<any>('/transportbookings', payload).catch(() => null);
      if (res) {
        const mapped = mapTransportBooking(res);
        setTransportBookings((prev) => [mapped, ...prev]);
        return mapped;
      }
    } catch (e) {
      console.warn('Backend bookTransport error:', e);
    }

    const booking: TransportBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTransportBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const updateTransportStatus = async (bookingId: string, status: TransportBooking['status']) => {
    try {
      await apiClient.put(`/transportbookings/${bookingId}/status`, { bookingStatus: status }).catch(() => {});
    } catch (e) {
      console.warn('Backend updateTransportStatus error:', e);
    }

    setTransportBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const updatedTimeline = b.timeline.map((step) => {
          if (step.status.toLowerCase() === status.toLowerCase()) {
            return { ...step, done: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          }
          return step;
        });
        return { ...b, status, timeline: updatedTimeline };
      })
    );
  };

  const dismissAlert = async (alertId: string) => {
    try {
      await apiClient.put(`/abnormalpricealerts/${alertId}/dismiss`, {}).catch(() => {});
    } catch (e) {
      console.warn('Backend dismissAlert error:', e);
    }
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: 'Dismissed' } : a)));
  };

  const markNotificationRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`, {}).catch(() => {});
    } catch (e) {
      console.warn('Backend markNotificationRead error:', e);
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const toggleUserVerification = async (userId: string) => {
    try {
      await apiClient.put(`/userverifications/${userId}/verify`, { verificationStatus: 'Approved' }).catch(() => {});
    } catch (e) {
      console.warn('Backend toggleUserVerification error:', e);
    }
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, verified: !u.verified } : u)));
  };

  return (
    <DataContext.Provider
      value={{
        crops,
        buyerRequirements,
        buyerOffers,
        chatMessages,
        transactions,
        transportBookings,
        alerts,
        notifications,
        usersList,
        marketPrices,
        isLoading,
        refreshData,
        addCrop,
        updateCrop,
        uploadCropImage,
        deleteCrop,
        addRequirement,
        sendOffer,
        updateOfferStatus,
        sendChatMessage,
        createTransactionFromOffer,
        bookTransport,
        updateTransportStatus,
        dismissAlert,
        markNotificationRead,
        toggleUserVerification
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
