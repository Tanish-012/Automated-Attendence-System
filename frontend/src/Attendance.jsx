import { useState, useMemo } from 'react';
import { Download, Calendar, Filter, AlertTriangle } from 'lucide-react';
import { useAppStore } from './context/AppDataContext';
import './Attendance.css';

const Attendance = () => {
    const { data } = useAppStore();
    const { students, classes, stats } = data;
    
    const [dayFilter, setDayFilter] = useState(stats.todayDay);
    const [classFilter, setClassFilter] = useState('all');

    // Generate logs by class per day to mimic the original logic
    const attendanceLogs = useMemo(() => {
        let logs = [];
        // We will build logs for the last 7 days for performance, or all 30 days. Let's do 30.
        for(let day = 1; day <= 30; day++) {
            classes.forEach(c => {
                const classStudents = students.filter(s => s.classDetails === c.id);
                if(classStudents.length === 0) return;
                
                let present = 0;
                let absent = 0;
                classStudents.forEach(s => {
                    const att = s.attendance.find(a => a.day === day);
                    if(att && att.present) present++;
                    else absent++;
                });

                logs.push({
                    id: `log-${c.id}-day-${day}`,
                    day: day,
                    classId: c.id,
                    teacher: c.teachers[0] || 'Unassigned',
                    total: classStudents.length,
                    present,
                    absent,
                    status: day > stats.todayDay ? 'Scheduled' : 'Synced'
                });
            });
        }
        // sort descending
        return logs.sort((a,b) => b.day - a.day);
    }, [classes, students, stats.todayDay]);

    const filteredLogs = attendanceLogs.filter(log => {
        const matchesDay = dayFilter === 'all' || log.day === parseInt(dayFilter);
        const matchesClass = classFilter === 'all' || log.classId === classFilter;
        return matchesDay && matchesClass && log.day <= stats.todayDay; // Don't show future days in standard list unless filtered
    });

    // Analytics Calculation
    const overallRate = useMemo(() => {
        const pastLogs = attendanceLogs.filter(l => l.day <= stats.todayDay);
        const totalPresent = pastLogs.reduce((acc, l) => acc + l.present, 0);
        const totalPossible = pastLogs.reduce((acc, l) => acc + l.total, 0);
        return totalPossible === 0 ? 0 : ((totalPresent / totalPossible) * 100).toFixed(1);
    }, [attendanceLogs, stats.todayDay]);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>📊 Attendance & Analytics</h2>
                    <p>Review daily logs, check sync status, and generate export reports.</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn">
                        <Download size={18} />
                        <span>Export Report (PDF)</span>
                    </button>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <h3>Overall Academic Month Rate</h3>
                    <div className="chart-placeholder">
                        <span className={`rate-text ${overallRate >= 90 ? 'text-success' : 'text-danger'}`}>{overallRate}%</span>
                        <p className="rate-sub">Target: 90%</p>
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="card-header">
                        <h3>Defaulters Alert</h3>
                        <span className="badge badge-warning">Action Needed</span>
                    </div>
                    <ul className="alert-list">
                        {students.slice(0, 3).map((s, idx) => (
                             <li key={idx}>
                                 <AlertTriangle size={16} className="text-warning" />
                                 <span><strong>{s.firstName} {s.lastName} ({s.classDetails})</strong> - Needs review</span>
                             </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="content-card">
                <div className="toolbar">
                    <div className="filter-group date-picker-group">
                        <Calendar size={18} className="text-secondary" />
                        <select
                            className="filter-select"
                            value={dayFilter}
                            onChange={(e) => setDayFilter(e.target.value)}
                        >
                            <option value={stats.todayDay}>Today (Day {stats.todayDay})</option>
                            <option value={stats.todayDay - 1}>Yesterday (Day {stats.todayDay - 1})</option>
                            <option value="all">Last 30 Days</option>
                            {Array.from({length: 30}).map((_, i) => (
                                <option key={i+1} value={i+1}>Day {i+1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <Filter size={18} className="text-secondary" />
                        <select 
                            className="filter-select"
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        >
                            <option value="all">All Classes</option>
                            {classes.map(c => <option key={c.id} value={c.id}>Class {c.id}</option>)}
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Class</th>
                                <th>Teacher</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Sync Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td>Day {log.day}</td>
                                    <td><span className="badge badge-blue">{log.classId}</span></td>
                                    <td>{log.teacher}</td>
                                    <td className="text-success font-medium">{log.present}/{log.total}</td>
                                    <td className="text-danger font-medium">{log.absent}</td>
                                    <td>
                                        <span className={`status-indicator ${log.status === 'Synced' ? 'success' : 'warning'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-secondary">No attendance logs found for this filter.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
