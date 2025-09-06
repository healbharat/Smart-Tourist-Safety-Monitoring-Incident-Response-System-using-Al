
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Alert, Tourist, AnomalyType, Zone } from '../types';

interface DashboardViewProps {
  tourists: Tourist[];
  alerts: Alert[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: JSX.Element; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-brand-secondary p-5 rounded-lg shadow-lg flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-brand-light font-medium">{title}</p>
      <p className="text-2xl font-bold text-brand-text">{value}</p>
    </div>
  </div>
);

const MOCK_ZONES: Zone[] = [
    { id: 'zone1', name: 'National Park', type: 'restricted', polygon: [{lat: 28, lng: 77}, {lat: 28.1, lng: 77}, {lat: 28.1, lng: 77.1}, {lat: 28, lng: 77.1}] },
    { id: 'zone2', name: 'Mountain Peak Trail', type: 'high-risk', polygon: [{lat: 27.5, lng: 78}, {lat: 27.6, lng: 78}, {lat: 27.6, lng: 78.1}, {lat: 27.5, lng: 78.1}] },
    { id: 'zone3', name: 'City Center', type: 'safe', polygon: [{lat: 27.8, lng: 77.5}, {lat: 27.9, lng: 77.5}, {lat: 27.9, lng: 77.6}, {lat: 27.8, lng: 77.6}] },
];

const TouristMap: React.FC<{ tourists: Tourist[], alerts: Alert[] }> = ({ tourists, alerts }) => {
  const alertTouristIds = new Set(alerts.filter(a => a.status === 'new' || a.status === 'escalated').map(a => a.touristId));

  return (
    <div className="bg-brand-secondary p-4 rounded-lg h-full relative overflow-hidden">
      <h3 className="font-bold text-lg mb-4 text-brand-text">Live Tourist Locations</h3>
      <div className="w-full h-[90%] bg-brand-primary rounded-md relative border-2 border-brand-accent">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(128,128,128,0.5)" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
        
        {/* Mock Zones */}
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-green-500/10 border-2 border-dashed border-green-500 rounded-lg flex items-center justify-center">
            <span className="text-green-400 font-semibold text-sm">Safe Zone</span>
        </div>
        <div className="absolute top-[50%] left-[60%] w-[25%] h-[40%] bg-red-500/10 border-2 border-dashed border-red-500 rounded-lg flex items-center justify-center">
            <span className="text-red-400 font-semibold text-sm">High-Risk Zone</span>
        </div>
        <div className="absolute top-[5%] left-[70%] w-[25%] h-[30%] bg-yellow-500/10 border-2 border-dashed border-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-yellow-400 font-semibold text-sm">Restricted Zone</span>
        </div>
        
        {/* Tourist Dots */}
        {tourists.map(tourist => {
            const lastLocation = tourist.locationHistory[tourist.locationHistory.length - 1];
            // Normalize lat/lng to percentages for positioning
            const top = (90 - (lastLocation.lat - 27) * 40);
            const left = ((lastLocation.lng - 77) * 40);
            
            const isInAlert = alertTouristIds.has(tourist.id);

            return (
                <div 
                    key={tourist.id} 
                    className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group`}
                    style={{ top: `${top}%`, left: `${left}%` }}
                >
                    <div className={`w-full h-full rounded-full ${isInAlert ? 'bg-brand-red animate-ping' : 'bg-brand-green'}`}></div>
                    <div className={`absolute top-0 left-0 w-full h-full rounded-full ${isInAlert ? 'bg-brand-red' : 'bg-brand-green'} border-2 ${isInAlert ? 'border-red-300' : 'border-green-300'}`}></div>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                        {tourist.kyc.firstName} {tourist.kyc.lastName}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

const AlertsFeed: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
    const getAlertIcon = (type: AnomalyType) => {
        switch (type) {
            case AnomalyType.PANIC_BUTTON: return <span className="text-brand-red">🚨</span>;
            case AnomalyType.GEO_FENCE_BREACH: return <span className="text-brand-yellow">🚧</span>;
            case AnomalyType.PROLONGED_INACTIVITY: return <span className="text-brand-light">⏳</span>;
            default: return <span className="text-brand-accent">⚠️</span>;
        }
    }
    return (
        <div className="bg-brand-secondary p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4 text-brand-text">Real-time Alerts</h3>
            <div className="space-y-3 h-80 overflow-y-auto pr-2">
                {alerts.filter(a => a.status === 'new').slice(0, 10).map(alert => (
                    <div key={alert.id} className="bg-brand-primary p-3 rounded-md flex items-start space-x-3">
                        <div className="text-xl mt-1">{getAlertIcon(alert.type)}</div>
                        <div>
                            <p className="font-semibold text-sm">{alert.type}</p>
                            <p className="text-xs text-brand-light">{alert.touristName} - {new Date(alert.timestamp).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};


export const DashboardView: React.FC<DashboardViewProps> = ({ tourists, alerts }) => {
    const activeAlerts = alerts.filter(a => a.status === 'new' || a.status === 'escalated').length;
    
    const touristDistributionData = tourists.reduce((acc, tourist) => {
        const region = tourist.tripItinerary[0]?.location || 'Unknown';
        const existingRegion = acc.find(item => item.name === region);
        if (existingRegion) {
            existingRegion.tourists++;
        } else {
            acc.push({ name: region, tourists: 1 });
        }
        return acc;
    }, [] as { name: string, tourists: number }[]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Tourists" value={tourists.length} icon={<UsersIcon />} color="bg-blue-500" />
                <StatCard title="Active Alerts" value={activeAlerts} icon={<AlertIcon />} color="bg-red-500" />
                <StatCard title="Tourists in Safe Zones" value={tourists.filter(t => t.safetyScore > 80).length} icon={<CheckIcon />} color="bg-green-500" />
                <StatCard title="High-Risk Tourists" value={tourists.filter(t => t.safetyScore < 40).length} icon={<WarningIcon />} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[500px]">
                  <TouristMap tourists={tourists} alerts={alerts} />
                </div>
                <div className="lg:col-span-1">
                   <AlertsFeed alerts={alerts} />
                </div>
            </div>

            <div className="bg-brand-secondary p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 text-brand-text">Tourist Distribution by Region</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={touristDistributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="#778DA9" />
                            <YAxis stroke="#778DA9" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1B263B',
                                    border: '1px solid #415A77',
                                    color: '#E0E1DD'
                                }}
                            />
                            <Bar dataKey="tourists" fill="#415A77" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


// Icons
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

