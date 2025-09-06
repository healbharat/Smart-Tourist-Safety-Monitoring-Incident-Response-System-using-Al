
import { GoogleGenAI, Type } from "@google/genai";
import { Tourist, Alert } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be caught by the App component and show an error message.
  // The app will then fall back to mock data.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const touristSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique blockchain-style hash ID for the tourist.'},
        kyc: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: "ID type, either 'Passport' or 'Aadhaar'."},
                idNumber: { type: Type.STRING, description: 'The ID number.'},
                firstName: { type: Type.STRING, description: 'Tourist first name.'},
                lastName: { type: Type.STRING, description: 'Tourist last name.'},
                nationality: { type: Type.STRING, description: 'Tourist nationality.'},
                dob: { type: Type.STRING, description: 'Date of birth in ISO 8601 format (YYYY-MM-DD).'},
            },
        },
        tripItinerary: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    location: { type: Type.STRING, description: 'Location name in Northeast India.' },
                    date: { type: Type.STRING, description: 'Date for this itinerary item in ISO 8601 format (YYYY-MM-DD).' },
                    activity: { type: Type.STRING, description: 'Planned activity.' },
                },
            },
        },
        emergencyContacts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    phone: { type: Type.STRING },
                },
            },
        },
        safetyScore: { type: Type.INTEGER, description: 'A score from 0 to 100.' },
        locationHistory: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    lat: { type: Type.NUMBER, description: 'Latitude between 27 and 29.' },
                    lng: { type: Type.NUMBER, description: 'Longitude between 77 and 79.' },
                    timestamp: { type: Type.STRING, description: 'Timestamp in ISO 8601 format.' },
                },
            },
        },
        status: { type: Type.STRING, description: "Status: 'active', 'inactive', or 'distress'." },
        entryDate: { type: Type.STRING, description: 'Entry date in ISO 8601 format.' },
        exitDate: { type: Type.STRING, description: 'Exit date in ISO 8601 format.' },
    },
};

export const generateTourists = async (count: number): Promise<Tourist[]> => {
    if (!API_KEY) {
        throw new Error("API_KEY not configured.");
    }
    const prompt = `Generate a diverse list of ${count} tourist profiles for a safety monitoring system in Northeast India. Ensure variety in names, nationalities (include Indian and international), itineraries, and safety scores. The location coordinates (lat, lng) should be within a realistic range for the region, for example, latitude between 27.0 and 29.0, and longitude between 77.0 and 79.0. Create a few location history points for each tourist.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: touristSchema
            },
        },
    });
    
    const jsonString = response.text.trim();
    const tourists = JSON.parse(jsonString);

    // Basic validation
    if (!Array.isArray(tourists)) {
        throw new Error("AI did not return a valid array of tourists.");
    }

    return tourists as Tourist[];
};

export const generateEFIR = async (alert: Alert, tourist: Tourist): Promise<string> => {
    if (!API_KEY) {
        throw new Error("API_KEY not configured.");
    }
    const prompt = `
        Based on the following JSON data for a tourist and a safety alert, generate a formal E-FIR (First Information Report) for a missing person case. The report should be structured, professional, and ready for police use.

        **Alert Data:**
        ${JSON.stringify(alert, null, 2)}

        **Tourist Data:**
        ${JSON.stringify(tourist, null, 2)}

        **Instructions:**
        1.  Start with a clear heading: "FIRST INFORMATION REPORT (E-FIR)".
        2.  Include sections for:
            - Case Number (generate a placeholder)
            - Date and Time of Report
            - Reporting Officer (use "System Generated - Aegis Dashboard")
            - Details of the Missing Person (from tourist KYC data)
            - Circumstances of Disappearance (based on the alert type, last known location, and timestamp)
            - Last Known Location Details
            - Itinerary Details
            - Emergency Contact Information
            - Initial Assessment and Recommended Actions
        3.  The tone should be formal and official.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
};
