
import { Tourist, Alert, AnomalyType } from '../types';

export const MOCK_TOURISTS: Tourist[] = [
  {
    id: 'bcd01-a7b2-c3d4-e5f6-g7h8i9j0k1l2',
    kyc: {
      type: 'Passport',
      idNumber: 'A12345678',
      firstName: 'John',
      lastName: 'Doe',
      nationality: 'USA',
      dob: '1990-05-15',
    },
    tripItinerary: [
      { location: 'Shillong', date: '2024-10-20', activity: 'Sightseeing' },
      { location: 'Cherrapunji', date: '2024-10-22', activity: 'Trekking' },
    ],
    emergencyContacts: [{ name: 'Jane Doe', phone: '123-456-7890' }],
    safetyScore: 85,
    locationHistory: [
      { lat: 28.5, lng: 77.2, timestamp: new Date().toISOString() },
      { lat: 28.51, lng: 77.22, timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    status: 'active',
    entryDate: '2024-10-18',
    exitDate: '2024-10-25',
  },
  {
    id: 'bcd02-b8c3-d4e5-f6g7-h8i9j0k1l2m3',
    kyc: {
      type: 'Aadhaar',
      idNumber: '1234 5678 9012',
      firstName: 'Priya',
      lastName: 'Sharma',
      nationality: 'Indian',
      dob: '1995-08-22',
    },
    tripItinerary: [
        { location: 'Tawang', date: '2024-11-01', activity: 'Monastery Visit' },
        { location: 'Guwahati', date: '2024-11-05', activity: 'River Cruise' },
    ],
    emergencyContacts: [{ name: 'Amit Sharma', phone: '987-654-3210' }],
    safetyScore: 35,
    locationHistory: [
        { lat: 27.6, lng: 78.1, timestamp: new Date().toISOString() },
        { lat: 27.58, lng: 78.05, timestamp: new Date(Date.now() - 7200000).toISOString() },
    ],
    status: 'distress',
    entryDate: '2024-10-30',
    exitDate: '2024-11-07',
  },
  {
    id: 'bcd03-c9d4-e5f6-g7h8-i9j0k1l2m3n4',
    kyc: {
        type: 'Passport',
        idNumber: 'B87654321',
        firstName: 'Hans',
        lastName: 'Müller',
        nationality: 'German',
        dob: '1988-03-10',
    },
    tripItinerary: [
        { location: 'Kaziranga', date: '2024-10-25', activity: 'Wildlife Safari' },
    ],
    emergencyContacts: [{ name: 'Greta Müller', phone: '011-49-12345' }],
    safetyScore: 62,
    locationHistory: [
        { lat: 27.9, lng: 77.5, timestamp: new Date().toISOString() },
    ],
    status: 'active',
    entryDate: '2024-10-24',
    exitDate: '2024-11-02',
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-01',
    touristId: 'bcd02-b8c3-d4e5-f6g7-h8i9j0k1l2m3',
    touristName: 'Priya Sharma',
    type: AnomalyType.PANIC_BUTTON,
    timestamp: new Date().toISOString(),
    location: { lat: 27.6, lng: 78.1, timestamp: new Date().toISOString() },
    status: 'new',
    details: 'Panic button activated near Tawang Monastery.',
  },
  {
    id: 'alert-02',
    touristId: 'bcd01-a7b2-c3d4-e5f6-g7h8i9j0k1l2',
    touristName: 'John Doe',
    type: AnomalyType.GEO_FENCE_BREACH,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    location: { lat: 28.5, lng: 77.2, timestamp: new Date(Date.now() - 1800000).toISOString() },
    status: 'acknowledged',
    details: 'Entered a restricted military zone.',
  },
];
