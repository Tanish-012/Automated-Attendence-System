import { useState } from 'react';
import { Utensils, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAppStore } from './context/AppDataContext';
import './Dashboard.css';

const MidDayMeals = () => {
    const { data } = useAppStore();
    const [selectedClass, setSelectedClass] = useState(null);
    const [lastGeneratedTime, setLastGeneratedTime] = useState('Not generated today');

    const handleGenerateReport = () => {
        const timeStr = new Date().toLocaleTimeString();
        setLastGeneratedTime(timeStr);
        alert(`Meals generated and confirmed for all present students at ${timeStr}`);
    };

    if (selectedClass) {
        const classStudents = data.students.filter(s => s.classDetails === selectedClass.id);
        const presentStudents = classStudents.filter(s => {
            const todayAtt = s.attendance.find(a => a.day === data.stats.todayDay);
            return todayAtt && todayAtt.present;
        });

        return (
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h2>🍲 Meal Details: Class {selectedClass.id}</h2>
                        <p>Individual class report for mid-day meals.</p>
                    </div>
                    <button className="secondary-btn" onClick={() => setSelectedClass(null)}>
                        <ArrowLeft size={18} /> Back to Classes
                    </button>
                </div>
                <div className="content-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div className="stat-card primary">
                            <h3>Enrolled</h3>
                            <h2>{classStudents.length}</h2>
                        </div>
                        <div className="stat-card success">
                            <h3>Present (Meal Eligible)</h3>
                            <h2>{presentStudents.length}</h2>
                        </div>
                    </div>
                    <h3>Eligible Students List</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Preference (Simulated)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {presentStudents.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>Standard Veg</td>
                                    <td><span className="status-indicator success"><CheckCircle size={14} style={{marginRight: '4px'}}/> Approved</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>🍲 Mid-Day Meals Management</h2>
                    <p>Track class-wise meal requirements based on live attendance.</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={handleGenerateReport}>
                        <RefreshCw size={18} />
                        <span>Generate Target Report</span>
                    </button>
                </div>
            </div>

            <div className="content-card" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Utensils size={24} color="#3b82f6" />
                    <div>
                        <h4 style={{ margin: 0 }}>Latest Sync Time</h4>
                        <p style={{ margin: 0, color: 'gray', fontSize: '14px' }}>{lastGeneratedTime}</p>
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Class (Grade & Sec)</th>
                            <th>Total Enrolled</th>
                            <th>Attendance Today</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.classes.map(c => {
                            const classStudents = data.students.filter(s => s.classDetails === c.id);
                            const classPresent = classStudents.filter(s => {
                                const todayAtt = s.attendance.find(a => a.day === data.stats.todayDay);
                                return todayAtt && todayAtt.present;
                            }).length;

                            return (
                                <tr key={c.id}>
                                    <td className="font-medium">Class {c.id}</td>
                                    <td>{classStudents.length}</td>
                                    <td style={{ color: classPresent === classStudents.length ? 'green' : 'inherit' }}>
                                        {classPresent}
                                    </td>
                                    <td>
                                        <button className="secondary-btn" onClick={() => setSelectedClass(c)}>
                                            View Report
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MidDayMeals;
