
export enum View {
  DASHBOARD = 'DASHBOARD',
  TOURISTS = 'TOURISTS',
  ALERTS = 'ALERTS',
}

export enum AnomalyType {
  PANIC_BUTTON = 'Panic Button',
  GEO_FENCE_BREACH = 'Geo-fence Breach',
  ROUTE_DEVIATION = 'Route Deviation',
  PROLONGED_INACTIVITY = 'Prolonged Inactivity',
  LOCATION_DROPOFF = 'Location Drop-off',
}

export interface KYC {
  type: 'Aadhaar' | 'Passport';
  idNumber: string;
  firstName: string;
  lastName: string;
  nationality: string;
  dob: string;
}

export interface ItineraryItem {
  location: string;
  date: string;
  activity: string;
}

export interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: string;
  zoneId?: string;
}

export interface Tourist {
  id: string; // Blockchain-based Digital ID
  kyc: KYC;
  tripItinerary: ItineraryItem[];
  emergencyContacts: { name: string; phone: string }[];
  safetyScore: number; // 0-100
  locationHistory: LocationPoint[];
  status: 'active' | 'inactive' | 'distress';
  entryDate: string;
  exitDate: string;
}

export interface Alert {
  id: string;
  touristId: string;
  touristName: string;
  type: AnomalyType;
  timestamp: string;
  location: LocationPoint;
  status: 'new' | 'acknowledged' | 'resolved' | 'escalated';
  details: string;
}

export interface Zone {
    id: string;
    name: string;
    type: 'safe' | 'restricted' | 'high-risk';
    polygon: { lat: number, lng: number }[];
}
