export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'admin';

export type Language = 'en' | 'gu' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  location: string;
  district?: string;
  state?: string;
  joinedDate: string;
  avatar?: string;
  farmDetails?: {
    farmSizeAcres: number;
    primaryCrops: string[];
    pickupAddress: string;
  };
  businessDetails?: {
    businessName: string;
    gstNumber?: string;
    businessType: string;
  };
  vehicleDetails?: {
    companyName: string;
    vehicleType: string;
    vehicleNumber: string;
    capacityKg: number;
  };
}

export type CropStatus = 'Active' | 'Under Negotiation' | 'Sold' | 'Expired';

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  variety: string;
  quantity: number;
  unit: string; // e.g. "kg", "quintal", "ton"
  grade: 'Grade A' | 'Grade B' | 'Grade C' | 'Premium';
  location: string;
  district: string;
  state: string;
  pickupLocation: string;
  expectedPrice: number; // per quintal or unit
  currentMarketPrice: number;
  aiFairPriceMin: number;
  aiFairPriceMax: number;
  status: CropStatus;
  harvestDate: string;
  expectedSellingDate: string;
  image: string;
  distanceKm: number;
  createdAt: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  verified: boolean;
  cropName: string;
  quantity: number;
  unit: string;
  grade: string;
  preferredLocation: string;
  offeredPrice: number;
  purchaseDate: string;
  deliveryRequirement: string;
  status: 'Active' | 'Fulfilled' | 'Closed';
  createdAt: string;
}

export interface PricePoint {
  date: string;
  price: number;
  predicted?: number;
}

export interface PriceIntelligence {
  cropName: string;
  market: string;
  currentPrice: number;
  unit: string;
  aiFairPriceMin: number;
  aiFairPriceMax: number;
  predicted7DayPrice: number;
  buyerAvgOffer: number;
  confidencePercent: number;
  priceTrend: 'up' | 'down' | 'stable';
  changePercent: number;
  historicalData: PricePoint[];
  recommendation: 'WAIT' | 'SELL_NOW' | 'STABLE';
  recommendationReason: string;
  demandSignal: string;
  supplySignal: string;
}

export interface AbnormalPriceAlert {
  id: string;
  cropName: string;
  buyerId: string;
  buyerName: string;
  offeredPrice: number;
  fairPriceMin: number;
  fairPriceMax: number;
  differencePercent: number;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Dismissed' | 'Investigating';
  date: string;
}

export interface BuyerOffer {
  id: string;
  cropListingId: string;
  cropName: string;
  buyerId: string;
  buyerName: string;
  buyerVerified: boolean;
  offeredPrice: number;
  quantity: number;
  unit: string;
  totalAmount: number;
  deliveryDate: string;
  compatibilityScore: number; // 0 to 100
  distanceKm: number;
  purchaseDate: string;
  gradeRequirement: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Countered';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  negotiationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  offerData?: {
    price: number;
    quantity: number;
    unit: string;
    deliveryDate: string;
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Countered';
  };
}

export type TransactionStatus = 
  | 'Deal Confirmed' 
  | 'Transportation Arranged' 
  | 'Pickup' 
  | 'In Transit' 
  | 'Delivered' 
  | 'Completed';

export interface Transaction {
  id: string;
  receiptNo: string;
  cropListingId: string;
  cropName: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  quantity: number;
  unit: string;
  agreedPrice: number;
  totalAmount: number;
  purchaseDate: string;
  deliveryStatus: TransactionStatus;
  transportBookingId?: string;
  createdAt: string;
}

export interface TransporterProfile {
  id: string;
  companyName: string;
  driverName: string;
  vehicleType: 'Mini Truck' | 'Pickup' | 'Tata 407' | 'Large Truck';
  vehicleNumber: string;
  capacityKg: number;
  phone: string;
  rating: number;
  totalDeliveries: number;
  pricePerKm: number;
  distanceKm: number;
  available: boolean;
}

export type TransportStatus = 'Booking Confirmed' | 'Pickup Completed' | 'In Transit' | 'Delivered' | 'Cancelled';

export interface TransportBooking {
  id: string;
  transactionId: string;
  farmerName: string;
  farmerPhone: string;
  pickupLocation: string;
  buyerName: string;
  buyerPhone: string;
  deliveryLocation: string;
  cropName: string;
  quantityKg: number;
  distanceKm: number;
  estimatedCost: number;
  transporterId: string;
  transporterName: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: TransportStatus;
  eta: string;
  bookingDate: string;
  timeline: {
    status: string;
    timestamp: string;
    done: boolean;
  }[];
}

export interface DemandForecast {
  cropName: string;
  location: string;
  currentDemandIndex: number; // 0 to 100
  forecast7DaysPercent: number;
  forecast30DaysPercent: number;
  trend: 'Increasing' | 'Decreasing' | 'Stable';
  bestSellingWindow: string;
  supplyTrend: string;
  expectedPriceImpact: string;
  chartData: {
    day: string;
    historical: number;
    forecast: number;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  role: UserRole | 'all';
  title: string;
  message: string;
  type: 'offer' | 'price' | 'demand' | 'transport' | 'transaction' | 'system';
  date: string;
  read: boolean;
  link?: string;
}
