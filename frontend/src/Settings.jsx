import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import './Dashboard.css'; // Reuse basic layout styling

const Settings = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Settings</h2>
            </div>
            
            <div className="dashboard-content">
                <div className="quick-actions-card">
                    <h3>Account Profile</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '24px' }}>AD</div>
                        <div>
                            <h2 style={{ margin: 0 }}>Tanish Kumar</h2>
                            <span style={{ color: 'gray' }}>System Administrator</span>
                        </div>
                    </div>
                </div>

                <div className="quick-actions-card mt-4">
                    <h3>System Actions</h3>
                    <div className="actions-grid">
                        <button className="action-btn" onClick={handleLogout} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
