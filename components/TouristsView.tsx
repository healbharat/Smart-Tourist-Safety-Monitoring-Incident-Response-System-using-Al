
import React, { useState } from 'react';
import { Tourist, LocationPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';


const TouristDetailsModal: React.FC<{ tourist: Tourist | null; onClose: () => void }> = ({ tourist, onClose }) => {
  if (!tourist) return null;
  
  const safetyScoreColor = tourist.safetyScore > 70 ? 'text-brand-green' : tourist.safetyScore > 40 ? 'text-brand-yellow' : 'text-brand-red';

  const locationChartData = tourist.locationHistory.map(loc => ({
      time: new Date(loc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
      lat: loc.lat,
      lng: loc.lng
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-4xl p-8 m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Tourist Digital ID</h2>
          <button onClick={onClose} className="text-brand-light hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                <img src={`https://i.pravatar.cc/150?u=${tourist.id}`} alt="Tourist" className="w-32 h-32 rounded-full mx-auto border-4 border-brand-accent" />
                <div className="text-center">
                    <p className="text-xl font-bold">{tourist.kyc.firstName} {tourist.kyc.lastName}</p>
                    <p className="text-brand-light">{tourist.kyc.nationality}</p>
                </div>
                <div className="bg-brand-primary p-4 rounded-lg text-center">
                    <p className="text-sm text-brand-light">Safety Score</p>
                    <p className={`text-5xl font-bold ${safetyScoreColor}`}>{tourist.safetyScore}</p>
                </div>
                 <div className="bg-brand-primary p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-brand-text">KYC Details</h4>
                    <p className="text-sm"><span className="text-brand-light">ID Type:</span> {tourist.kyc.type}</p>
                    <p className="text-sm"><span className="text-brand-light">ID Number:</span> {tourist.kyc.idNumber}</p>
                    <p className="text-sm"><span className="text-brand-light">DOB:</span> {new Date(tourist.kyc.dob).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="md:col-span-2 space-y-6">
                <div className="bg-brand-primary p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-brand-text">Trip Itinerary</h4>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {tourist.tripItinerary.map((item, index) => (
                            <li key={index} className="text-sm flex items-start">
                                <span className="text-brand-accent mr-2 mt-1">&#9679;</span>
                                <div>
                                    <span className="font-medium">{item.location} ({new Date(item.date).toLocaleDateString()})</span>
                                    <p className="text-brand-light">{item.activity}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-brand-primary p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-brand-text">Emergency Contacts</h4>
                    <ul className="space-y-1">
                        {tourist.emergencyContacts.map((contact, index) => (
                            <li key={index} className="text-sm">
                                <span className="font-medium">{contact.name}:</span> <span className="text-brand-light">{contact.phone}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-brand-primary p-4 rounded-lg h-64">
                    <h4 className="font-semibold mb-2 text-brand-text">Location History (Lat/Lng)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={locationChartData} margin={{ top: 5, right: 20, left: -15, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="time" stroke="#778DA9" />
                            <YAxis domain={['dataMin - 0.1', 'dataMax + 0.1']} stroke="#778DA9" />
                            <Tooltip contentStyle={{ backgroundColor: '#0D1B2A', border: '1px solid #415A77' }}/>
                            <Line type="monotone" dataKey="lat" stroke="#8884d8" strokeWidth={2} dot={false} name="Latitude" />
                            <Line type="monotone" dataKey="lng" stroke="#82ca9d" strokeWidth={2} dot={false} name="Longitude"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


export const TouristsView: React.FC<{ tourists: Tourist[] }> = ({ tourists }) => {
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTourists = tourists.filter(tourist =>
    `${tourist.kyc.firstName} ${tourist.kyc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tourist.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusChip = (status: 'active' | 'inactive' | 'distress') => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">Active</span>;
      case 'inactive': return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">Inactive</span>;
      case 'distress': return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">Distress</span>;
    }
  };

  return (
    <>
      <div className="bg-brand-secondary p-4 rounded-lg shadow-lg">
        <div className="mb-4">
             <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-brand-primary text-brand-text rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent"
             />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-brand-light">
            <thead className="text-xs text-brand-text uppercase bg-brand-primary">
              <tr>
                <th scope="col" className="px-6 py-3">Tourist ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Nationality</th>
                <th scope="col" className="px-6 py-3">Safety Score</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTourists.map(tourist => (
                <tr key={tourist.id} className="bg-brand-secondary border-b border-brand-primary hover:bg-brand-accent/20">
                  <td className="px-6 py-4 font-mono text-xs">{tourist.id}</td>
                  <td className="px-6 py-4 font-medium text-brand-text whitespace-nowrap">{tourist.kyc.firstName} {tourist.kyc.lastName}</td>
                  <td className="px-6 py-4">{tourist.kyc.nationality}</td>
                  <td className={`px-6 py-4 font-bold ${tourist.safetyScore > 70 ? 'text-green-400' : tourist.safetyScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {tourist.safetyScore}
                  </td>
                  <td className="px-6 py-4">{getStatusChip(tourist.status)}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelectedTourist(tourist)} className="font-medium text-blue-400 hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <TouristDetailsModal tourist={selectedTourist} onClose={() => setSelectedTourist(null)} />
    </>
  );
};
