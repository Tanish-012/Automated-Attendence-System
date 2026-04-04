import { useState } from 'react';
import { Calendar, UserPlus, FileEdit, RefreshCw } from 'lucide-react';
import { useAppStore } from './context/AppDataContext';
import './Dashboard.css';

const Staff = () => {
    const { data, updateData } = useAppStore();
    const [assignedLog, setAssignedLog] = useState('');

    const handleAssignSubstitute = (emergencyStaff) => {
        // Find a random available staff who doesn't have an emergency
        const availableStaff = data.staffs.filter(s => s.status === 'active' && s.id !== emergencyStaff.id);
        
        if (availableStaff.length > 0) {
            // Pick a random available staff via shuffle
            const substitute = availableStaff[Math.floor(Math.random() * availableStaff.length)];
            
            setAssignedLog(`Shuffled and assigned ${substitute.name} to cover for ${emergencyStaff.name}.`);
            
            // Mark the emergency as resolved
            const updated = { ...data };
            const eIndex = updated.staffs.findIndex(s => s.id === emergencyStaff.id);
            if (eIndex > -1) {
                updated.staffs[eIndex].status = 'active'; // Resolve their state temporarily for UI demonstration
                // Also remove from emergencies log
                updated.emergencies = updated.emergencies.filter(e => e.staffId !== emergencyStaff.id);
            }
            updateData(updated);
        } else {
            setAssignedLog(`No available staff. Shuffling schedule failed!`);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>👩‍🏫 Staff & Duty Roster</h2>
                    <p>Manage teacher assignments, timetables, and substitutions.</p>
                </div>
            </div>

            {assignedLog && (
                <div className="status-indicator success" style={{ marginBottom: '20px', padding: '15px' }}>
                    {assignedLog}
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
                <div className="content-card" style={{ flex: 2, padding: '20px' }}>
                    <h3>All Staff Directory ({data.staffs.length})</h3>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Subject</th>
                                    <th>Class Assigned</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.staffs.map(staff => (
                                    <tr key={staff.id}>
                                        <td>{staff.id}</td>
                                        <td>{staff.name}</td>
                                        <td>{staff.subject}</td>
                                        <td>{staff.assignedClass || 'Unassigned'}</td>
                                        <td>
                                            <span className={`status-indicator ${staff.status === 'active' ? 'success' : 'danger'}`}>
                                                {staff.status === 'active' ? 'Available' : 'Emergency'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="content-card" style={{ flex: 1, padding: '20px' }}>
                    <h3 style={{ color: '#ef4444' }}>Pending Substitutions</h3>
                    <p style={{ color: 'gray', marginBottom: '20px' }}>Teachers requiring cover.</p>
                    {data.staffs.filter(s => s.status === 'emergency').length === 0 ? (
                        <p>No emergencies currently.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {data.staffs.filter(s => s.status === 'emergency').map(staff => (
                                <div key={staff.id} style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px' }}>
                                    <h4 style={{ margin: '0 0 5px 0' }}>{staff.name}</h4>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'gray' }}>Class: {staff.assignedClass || 'Multiple'}</p>
                                    <button 
                                        className="primary-btn" 
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                                        onClick={() => handleAssignSubstitute(staff)}
                                    >
                                        <RefreshCw size={16} /> Assign/Shuffle Duty
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Staff;
