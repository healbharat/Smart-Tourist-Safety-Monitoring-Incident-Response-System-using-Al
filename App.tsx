
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TouristsView } from './components/TouristsView';
import { AlertsView } from './components/AlertsView';
import { View, Tourist, Alert, AnomalyType } from './types';
import { generateTourists as generateTouristsWithAI } from './services/geminiService';
import { MOCK_TOURISTS, MOCK_ALERTS } from './services/mockData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const populateWithMockData = useCallback(() => {
    setTourists(MOCK_TOURISTS);
    setAlerts(MOCK_ALERTS);
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    populateWithMockData();
  }, [populateWithMockData]);

  const generateAIData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newTourists = await generateTouristsWithAI(20);
      setTourists(newTourists);

      // Generate some alerts based on the new tourists
      const newAlerts: Alert[] = newTourists.slice(0, 5).map((tourist, index) => {
          const anomalyTypes = Object.values(AnomalyType);
          const randomAnomaly = anomalyTypes[index % anomalyTypes.length];
          return {
            id: `alert-${Date.now()}-${index}`,
            touristId: tourist.id,
            touristName: `${tourist.kyc.firstName} ${tourist.kyc.lastName}`,
            type: randomAnomaly,
            timestamp: new Date().toISOString(),
            location: tourist.locationHistory[tourist.locationHistory.length - 1],
            status: 'new',
            details: `Anomaly detected for tourist ${tourist.kyc.firstName}.`,
          };
      });
      setAlerts(newAlerts);

    } catch (err) {
      console.error("Failed to generate AI data:", err);
      setError("Failed to generate data using Gemini API. Falling back to mock data. Please ensure your API key is set up correctly.");
      populateWithMockData(); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <DashboardView tourists={tourists} alerts={alerts} />;
      case View.TOURISTS:
        return <TouristsView tourists={tourists} />;
      case View.ALERTS:
        return <AlertsView alerts={alerts} setAlerts={setAlerts} tourists={tourists} />;
      default:
        return <DashboardView tourists={tourists} alerts={alerts} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-primary font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onGenerateData={generateAIData} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-primary p-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {isLoading ? (
             <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-brand-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-brand-light">Loading Data...</p>
                </div>
            </div>
          ) : (
            renderView()
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
