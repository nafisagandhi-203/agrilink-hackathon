import type { TransporterProfile, TransportBooking } from '../types';
import { apiClient } from './apiClient';

// Known distances map between key agricultural hubs (in KM)
const distanceTable: Record<string, Record<string, number>> = {
  mumbai: { kolkata: 2050, delhi: 1420, ahmedabad: 530, rajkot: 700, surat: 280, vadodara: 410, pune: 150 },
  delhi: { mumbai: 1420, kolkata: 1530, ahmedabad: 940, rajkot: 1100, jaipur: 280, lucknow: 550 },
  rajkot: { ahmedabad: 215, surat: 440, vadodara: 290, junagadh: 102, jamnagar: 92, bhavnagar: 175, gondal: 40, morbi: 65, bhuj: 230 },
  ahmedabad: { rajkot: 215, surat: 265, vadodara: 110, gandhinagar: 30, anand: 75, nadiad: 45, mehsana: 75, bhuj: 330 },
  bhuj: { nadiad: 360, ahmedabad: 330, rajkot: 230, surat: 580, vadodara: 430, jamnagar: 260, gandhinagar: 340, morbi: 170 },
  surat: { ahmedabad: 265, rajkot: 440, vadodara: 155, nadiad: 220, bhuj: 580, mumbai: 280 }
};

const cityCoords: Record<string, [number, number]> = {
  ahmedabad: [23.0225, 72.5714],
  rajkot: [22.3039, 70.8022],
  surat: [21.1702, 72.8311],
  vadodara: [22.3072, 73.1812],
  gondal: [21.9619, 70.7923],
  morbi: [22.8173, 70.8372],
  mumbai: [19.0760, 72.8777],
  delhi: [28.7041, 77.1025]
};

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.25);
}

const mapTransporter = (p: any): TransporterProfile => ({
  id: String(p.transportProviderId || p.id),
  companyName: p.name || 'Agro Express Logistics',
  driverName: p.name ? `${p.name.split(' ')[0]} Operator` : 'Driver',
  vehicleType: (p.vehicleType as any) || 'Tata 407',
  vehicleNumber: p.vehicleNumber || 'GJ-03-AB-1234',
  capacityKg: Number(p.vehicleCapacity || 2000),
  phone: p.phoneNumber || '+91 91234 10001',
  rating: Number(p.rating || 4.7),
  totalDeliveries: 38,
  pricePerKm: 18,
  distanceKm: 15,
  available: Boolean(p.isAvailable !== false)
});

const defaultTransporters: TransporterProfile[] = [
  {
    id: '1',
    companyName: 'Agro Express Logistics',
    driverName: 'Vikram Singh',
    vehicleType: 'Tata 407',
    vehicleNumber: 'GJ-03-AB-1234',
    capacityKg: 2000,
    phone: '+91 91234 10001',
    rating: 4.8,
    totalDeliveries: 45,
    pricePerKm: 18,
    distanceKm: 12,
    available: true
  },
  {
    id: '2',
    companyName: 'Gujarat Cargo Movers',
    driverName: 'Harish Patel',
    vehicleType: 'Large Truck',
    vehicleNumber: 'GJ-05-CV-5678',
    capacityKg: 8000,
    phone: '+91 91234 10002',
    rating: 4.6,
    totalDeliveries: 82,
    pricePerKm: 24,
    distanceKm: 22,
    available: true
  }
];

export const transportService = {
  async getTransporters(): Promise<TransporterProfile[]> {
    try {
      const data = await apiClient.get<any[]>('/transportproviders');
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapTransporter);
      }
    } catch (e) {
      console.warn('transportService.getTransporters backend error:', e);
    }
    return defaultTransporters;
  },

  calculateRoute(origin: string, destination: string) {
    const origClean = (origin || 'Rajkot').toLowerCase().trim();
    const destClean = (destination || 'Ahmedabad').toLowerCase().trim();

    let distanceKm = 0;

    for (const [cityA, targetObj] of Object.entries(distanceTable)) {
      if (origClean.includes(cityA)) {
        for (const [cityB, dist] of Object.entries(targetObj)) {
          if (destClean.includes(cityB)) {
            distanceKm = dist;
            break;
          }
        }
      }
      if (distanceKm > 0) break;
    }

    if (distanceKm === 0) {
      if (origClean === destClean) {
        distanceKm = 15;
      } else {
        let coordA: [number, number] | null = null;
        let coordB: [number, number] | null = null;

        for (const [cityName, coords] of Object.entries(cityCoords)) {
          if (!coordA && origClean.includes(cityName)) coordA = coords;
          if (!coordB && destClean.includes(cityName)) coordB = coords;
        }

        if (coordA && coordB) {
          distanceKm = calculateHaversineKm(coordA[0], coordA[1], coordB[0], coordB[1]);
        } else {
          const sum = (origClean + destClean).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          distanceKm = (sum % 350) + 45;
        }
      }
    }

    const estimatedHours = Math.round((distanceKm / 55) * 10) / 10;
    const hours = Math.floor(estimatedHours);
    const minutes = Math.round((estimatedHours - hours) * 60);
    const etaText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    const ratePerKm = 18;
    const estimatedCost = Math.round(distanceKm * ratePerKm);

    return {
      origin,
      destination,
      distanceKm,
      estimatedTimeText: etaText,
      estimatedHours,
      estimatedCost
    };
  },

  async getBookings(): Promise<TransportBooking[]> {
    try {
      const data = await apiClient.get<any[]>('/transportbookings');
      if (Array.isArray(data) && data.length > 0) {
        return data.map((b: any) => ({
          id: String(b.transportBookingId || b.id),
          transactionId: String(b.transactionId || ''),
          cropName: 'Farm Produce',
          quantityKg: Number(b.cropQuantity || 1000),
          transporterId: String(b.transportProviderId || '1'),
          transporterName: b.transportProviderName || 'Transport Provider',
          driverName: 'Assigned Driver',
          driverPhone: '+91 98765 00000',
          vehicleType: b.vehicleType || 'Tata 407',
          vehicleNumber: b.vehicleNumber || 'GJ-03-XX-0000',
          farmerName: 'Farmer',
          farmerPhone: '+91 98765 43210',
          pickupLocation: b.pickupLocation || 'Farm Gate',
          buyerName: 'Buyer',
          buyerPhone: '+91 98250 12345',
          deliveryLocation: b.deliveryLocation || 'Market Mandi',
          distanceKm: Number(b.distanceKm || 50),
          estimatedCost: Number(b.estimatedTransportCost || b.agreedTransportCost || 2500),
          status: (b.bookingStatus as any) || 'Booking Confirmed',
          eta: '2 hrs 30 mins',
          bookingDate: b.requestedAt ? String(b.requestedAt).replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16),
          timeline: [
            { status: 'Booking Confirmed', timestamp: '10:00 AM', done: true },
            { status: 'Pickup Completed', timestamp: '01:00 PM', done: b.bookingStatus === 'In Transit' || b.bookingStatus === 'Delivered' },
            { status: 'In Transit', timestamp: '02:30 PM', done: b.bookingStatus === 'In Transit' || b.bookingStatus === 'Delivered' },
            { status: 'Delivered', timestamp: '05:00 PM', done: b.bookingStatus === 'Delivered' }
          ]
        }));
      }
    } catch (e) {
      console.warn('transportService.getBookings backend error:', e);
    }
    return [];
  }
};
