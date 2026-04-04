import { Users, UserX, UserCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './context/AppDataContext';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, colorClass, onClick }) => (
    <div className={`stat-card ${colorClass}`} onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="stat-header">
            <span className="stat-title">{title}</span>
            <div className="stat-icon-wrapper">
                <Icon size={20} />
            </div>
        </div>
        <div className="stat-body">
            <h2>{value}</h2>
            <span className="stat-trend">{trend}</span>
        </div>
    </div>
);

const Dashboard = () => {
    const { data } = useAppStore();
    const navigate = useNavigate();

    const { students, emergencies, stats } = data;
    const activeEmergencies = emergencies.filter(e => !e.resolved).length;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Welcome back, Admin 👋</h2>
                    <p>Here's what's happening today in Rural EduSync.</p>
                </div>
                <button className="primary-btn">Download Daily Report</button>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Students"
                    value={students.length}
                    icon={Users}
                    trend="Click to view classes"
                    colorClass="primary"
                    onClick={() => navigate('/drilldown/students')}
                />
                <StatCard
                    title="Present Today"
                    value={stats.totalPresent}
                    icon={UserCheck}
                    trend={`${((stats.totalPresent / students.length) * 100).toFixed(1)}% Attendance`}
                    colorClass="success"
                    onClick={() => navigate('/drilldown/present')}
                />
                <StatCard
                    title="Absent Today"
                    value={stats.totalAbsent}
                    icon={UserX}
                    trend="Click to view absentees"
                    colorClass="danger"
                    onClick={() => navigate('/drilldown/absent')}
                />
                <StatCard
                    title="Active Emergencies"
                    value={activeEmergencies}
                    icon={Activity}
                    trend={activeEmergencies === 0 ? "All clear" : `${activeEmergencies} active`}
                    colorClass="warning"
                    onClick={() => navigate('/emergencies')}
                />
            </div>

            <div className="dashboard-content">
                <div className="recent-activity-card">
                    <h3>Recent Sync Logs</h3>
                    <ul className="activity-list">
                        <li>
                            <div className="activity-indicator success"></div>
                            <div className="activity-details">
                                <strong>System Data Initialized</strong>
                                <span>Today</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="quick-actions-card">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                        <button className="action-btn" onClick={() => navigate('/students?action=add')}>Add Students</button>
                        <button className="action-btn" onClick={() => navigate('/communication')}>Broadcast Notice</button>
                        <button className="action-btn" onClick={() => navigate('/staff')}>Approve Leave</button>
                        <button className="action-btn" onClick={() => navigate('/meals')}>View Meal Req.</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
