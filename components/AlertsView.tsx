import React, { useState } from 'react';
import { Alert, AnomalyType, Tourist } from '../types';
import { generateEFIR } from '../services/geminiService';

const EFIRModal: React.FC<{ efirContent: string, onClose: () => void, touristName: string }> = ({ efirContent, onClose, touristName }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-2xl p-6 m-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Generated E-FIR for {touristName}</h2>
                    <button onClick={onClose} className="text-brand-light hover:text-white text-2xl">&times;</button>
                </div>
                <div className="bg-brand-primary p-4 rounded-md overflow-y-auto flex-grow">
                    <pre className="whitespace-pre-wrap text-sm text-brand-text font-mono">{efirContent}</pre>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-brand-accent hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg">Close</button>
                    <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Print / Save as PDF</button>
                </div>
            </div>
        </div>
    );
};

export const AlertsView: React.FC<{ alerts: Alert[]; setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>; tourists: Tourist[] }> = ({ alerts, setAlerts, tourists }) => {
    
    const [generatingEfir, setGeneratingEfir] = useState<string | null>(null);
    const [efirContent, setEfirContent] = useState<string>('');
    const [selectedTouristName, setSelectedTouristName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleStatusChange = (alertId: string, status: 'acknowledged' | 'resolved' | 'escalated') => {
        setAlerts(prevAlerts =>
            prevAlerts.map(alert =>
                alert.id === alertId ? { ...alert, status } : alert
            )
        );
    };

    const handleGenerateEFIR = async (alert: Alert) => {
        const tourist = tourists.find(t => t.id === alert.touristId);
        if (!tourist) return;
        
        setGeneratingEfir(alert.id);
        setError(null);
        try {
            const report = await generateEFIR(alert, tourist);
            setEfirContent(report);
            setSelectedTouristName(`${tourist.kyc.firstName} ${tourist.kyc.lastName}`);
        } catch(e) {
            console.error(e);
            setError("Failed to generate E-FIR. Please check your Gemini API key and try again.");
        } finally {
            setGeneratingEfir(null);
        }
    };
    
    const getAlertColor = (type: AnomalyType) => {
        switch (type) {
            case AnomalyType.PANIC_BUTTON: return 'border-l-4 border-red-500';
            case AnomalyType.GEO_FENCE_BREACH: return 'border-l-4 border-yellow-500';
            case AnomalyType.ROUTE_DEVIATION: return 'border-l-4 border-orange-500';
            case AnomalyType.PROLONGED_INACTIVITY: return 'border-l-4 border-blue-500';
            default: return 'border-l-4 border-gray-500';
        }
    };

    return (
        <>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Alert Management</h1>
                {error && <div className="bg-red-900 text-red-200 p-3 rounded-md">{error}</div>}
                {alerts.map(alert => (
                    <div key={alert.id} className={`bg-brand-secondary p-4 rounded-lg shadow-lg ${getAlertColor(alert.type)} flex flex-col md:flex-row md:items-center md:justify-between`}>
                        <div className="flex-1 mb-4 md:mb-0">
                            <p className="font-bold text-lg">{alert.type}</p>
                            <p className="text-sm text-brand-light">
                                Tourist: <span className="font-medium text-brand-text">{alert.touristName}</span> ({alert.touristId})
                            </p>
                            <p className="text-sm text-brand-light">
                                Time: {new Date(alert.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm text-brand-light">
                                Last Location: Lat {alert.location.lat.toFixed(4)}, Lng {alert.location.lng.toFixed(4)}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                             <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                alert.status === 'new' ? 'bg-red-500/30 text-red-300' :
                                alert.status === 'acknowledged' ? 'bg-yellow-500/30 text-yellow-300' :
                                alert.status === 'resolved' ? 'bg-green-500/30 text-green-300' :
                                'bg-purple-500/30 text-purple-300'
                            }`}>
                                {alert.status}
                            </span>
                            <select
                                value={alert.status}
                                onChange={(e) => handleStatusChange(alert.id, e.target.value as any)}
                                className="bg-brand-primary border border-brand-accent text-brand-text text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                            >
                                <option value="new">New</option>
                                <option value="acknowledged">Acknowledge</option>
                                <option value="resolved">Resolve</option>
                                <option value="escalated">Escalate</option>
                            </select>
                            <button
                                onClick={() => handleGenerateEFIR(alert)}
                                disabled={generatingEfir === alert.id}
                                className="bg-brand-red hover:bg-opacity-80 disabled:bg-brand-light text-white font-bold py-2 px-4 rounded-lg text-sm"
                            >
                                {generatingEfir === alert.id ? 'Generating...' : 'Generate E-FIR'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {efirContent && <EFIRModal efirContent={efirContent} onClose={() => setEfirContent('')} touristName={selectedTouristName} />}
        </>
    );
};