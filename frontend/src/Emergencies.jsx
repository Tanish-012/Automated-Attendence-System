import { useState } from 'react';
import { AlertCircle, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { useAppStore } from './context/AppDataContext';
import './Dashboard.css';

const Emergencies = () => {
    const { data, resolveEmergency, updateData } = useAppStore();
    const [alerts, setAlerts] = useState({});

    const handleNotify = (emergency) => {
        // Mock sending an SMS
        alert(`SMS Sent to parents of students in ${emergency.staffName}'s classes.\nMessage: "Your teacher has an emergency today, a substitute has been arranged."`);
        setAlerts(prev => ({ ...prev, [emergency.id]: 'Notified' }));
    };

    const handleResolve = (emergency) => {
        resolveEmergency(emergency.id);
        
        // Ensure the staff is back to active
        const updated = { ...data };
        const eIndex = updated.staffs.findIndex(s => s.id === emergency.staffId);
        if (eIndex > -1) {
            updated.staffs[eIndex].status = 'active';
            updateData(updated);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>🚨 System Emergencies</h2>
                    <p>Real-time day-wise emergency alerts and resolutions.</p>
                </div>
            </div>

            <div className="content-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Active Alerts for Today ({new Date().toLocaleDateString()})</h3>
                    <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                        {data.emergencies.length} Active
                    </div>
                </div>

                {data.emergencies.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'gray' }}>
                        <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 15px auto', display: 'block' }} />
                        <p>No active emergencies right now. All clear!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {data.emergencies.map((emergency) => (
                            <div key={emergency.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderLeft: '4px solid #ef4444', background: '#f8fafc', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{ padding: '10px', background: '#fee2e2', borderRadius: '50%', color: '#ef4444' }}>
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Staff Emergency: {emergency.staffName}</h4>
                                        <p style={{ margin: 0, color: '#475569', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Clock size={14} /> Reported on {emergency.date} | Details: {emergency.details}
                                        </p>
                                    </div>
                                </div>
                                <div className="actions-grid" style={{ minWidth: '300px' }}>
                                    <button 
                                        className="secondary-btn" 
                                        onClick={() => handleNotify(emergency)}
                                        disabled={alerts[emergency.id]}
                                    >
                                        <MessageSquare size={16} /> 
                                        {alerts[emergency.id] ? 'Parents Notified' : 'Notify Parents'}
                                    </button>
                                    <button className="primary-btn" onClick={() => handleResolve(emergency)} style={{ background: '#22c55e' }}>
                                        <CheckCircle size={16} /> Resolve Issue
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Emergencies;
