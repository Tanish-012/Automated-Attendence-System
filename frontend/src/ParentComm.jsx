import { useState } from 'react';
import { Send, Users, Smartphone } from 'lucide-react';
import { useAppStore } from './context/AppDataContext';
import './Dashboard.css';

const ParentComm = () => {
    const { data } = useAppStore();
    const [selectedTarget, setSelectedTarget] = useState('all');
    const [message, setMessage] = useState('');
    const [messageLog, setMessageLog] = useState([]);

    const handleBroadcast = (e) => {
        e.preventDefault();
        
        let targetStudents = [];
        if (selectedTarget === 'all') {
            targetStudents = data.students;
        } else {
            targetStudents = data.students.filter(s => s.classDetails === selectedTarget);
        }

        const numbers = targetStudents.map(s => s.parentNumber).filter(Boolean);
        const uniqueNumbers = [...new Set(numbers)];
        
        if (uniqueNumbers.length > 0) {
            alert(`[SIMULATED SMS] Sending to ${uniqueNumbers.length} parent phones (${selectedTarget}).\nMessage: "${message}"`);
            
            setMessageLog([{
                time: new Date().toLocaleTimeString(),
                target: selectedTarget,
                count: uniqueNumbers.length,
                text: message
            }, ...messageLog]);
            
            setMessage('');
        } else {
            alert('No phone numbers found for the selected target.');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>📱 Parent Communication Portal</h2>
                    <p>Send broadcast messages directly to parents' registered numbers.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div className="content-card" style={{ flex: 1, padding: '20px' }}>
                    <h3>Compose Broadcast</h3>
                    <form onSubmit={handleBroadcast}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Target Audience</label>
                            <select 
                                value={selectedTarget} 
                                onChange={(e) => setSelectedTarget(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            >
                                <option value="all">Every Parent (All Classes)</option>
                                {data.classes.map(c => <option key={c.id} value={c.id}>Parents of Class {c.id}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message Body</label>
                            <textarea 
                                required
                                rows="5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
                            ></textarea>
                            <div style={{ fontSize: '12px', color: 'gray', marginTop: '5px', textAlign: 'right' }}>
                                {message.length} chars (approx. {Math.ceil(message.length / 160) || 1} SMS unit)
                            </div>
                        </div>
                        <button type="submit" className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <Send size={18} /> Broadcast Now
                        </button>
                    </form>
                </div>

                <div className="content-card" style={{ flex: 1, padding: '20px' }}>
                    <h3>Recent Broadcasts</h3>
                    {messageLog.length === 0 ? (
                        <p style={{ color: 'gray' }}>No messages sent during this session.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messageLog.map((log, idx) => (
                                <div key={idx} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#3b82f6' }}>Target: {log.target}</span>
                                        <span style={{ fontSize: '13px', color: 'gray' }}>{log.time}</span>
                                    </div>
                                    <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>"{log.text}"</p>
                                    <div style={{ fontSize: '12px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <Smartphone size={14} /> Delivered to {log.count} numbers
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentComm;
