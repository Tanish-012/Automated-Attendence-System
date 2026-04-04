import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './context/AppDataContext';
import './Dashboard.css';

export const StudentsDrilldown = () => {
    const { data } = useAppStore();
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    
    if (selectedStudent) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Student Information: {selectedStudent.firstName} {selectedStudent.lastName}</h2>
                    <button onClick={() => setSelectedStudent(null)} className="action-btn">Back to Class</button>
                </div>
                <div className="dashboard-content">
                    <div className="recent-activity-card">
                        <p><strong>ID:</strong> {selectedStudent.id}</p>
                        <p><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</p>
                        <p><strong>Address:</strong> {selectedStudent.address}</p>
                        <p><strong>Parent Name:</strong> {selectedStudent.parentName}</p>
                        <p><strong>Parent Number:</strong> {selectedStudent.parentNumber}</p>
                        <p><strong>Joined:</strong> {selectedStudent.yearOfJoining}</p>
                        <p><strong>Class:</strong> {selectedStudent.classDetails}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedClass) {
        const classStudents = data.students.filter(s => s.classDetails === selectedClass.id);
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Class {selectedClass.id} Information</h2>
                    <button onClick={() => setSelectedClass(null)} className="action-btn">Back to Classes</button>
                </div>
                <div className="dashboard-content">
                    <div className="recent-activity-card">
                        <p><strong>Grade:</strong> {selectedClass.grade} | <strong>Section:</strong> {selectedClass.section}</p>
                        <p><strong>Assigned Teachers:</strong> {selectedClass.teachers.join(', ')}</p>
                    </div>
                    <h3>Students in Class</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {classStudents.map(student => (
                            <div key={student.id} className="stat-card primary" onClick={() => setSelectedStudent(student)} style={{ cursor: 'pointer' }}>
                                <p><strong>{student.firstName} {student.lastName}</strong></p>
                                <p>{student.id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>All Classes Overview</h2>
            </div>
            <div className="dashboard-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                    {data.classes.map(c => (
                        <div key={c.id} className="stat-card success" onClick={() => setSelectedClass(c)} style={{ cursor: 'pointer' }}>
                            <div className="stat-body">
                                <h2>Class {c.id}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const PresentDrilldown = () => {
    const { data } = useAppStore();
    const { classes, students, stats } = data;
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Attendance Today (By Class)</h2>
            </div>
            <div className="dashboard-content">
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead style={{ backgroundColor: '#f1f5f9' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Class</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Total Students</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Present</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map(c => {
                            const classStudents = students.filter(s => s.classDetails === c.id);
                            const classPresent = classStudents.filter(s => {
                                const todayAtt = s.attendance.find(a => a.day === stats.todayDay);
                                return todayAtt && todayAtt.present;
                            }).length;
                            return (
                                <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px' }}>{c.id}</td>
                                    <td style={{ padding: '12px' }}>{classStudents.length}</td>
                                    <td style={{ padding: '12px', color: 'green', fontWeight: 'bold' }}>{classPresent}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const AbsentDrilldown = () => {
    const { data } = useAppStore();
    const { students, stats } = data;

    const absentees = students.filter(s => {
        const todayAtt = s.attendance.find(a => a.day === stats.todayDay);
        return !todayAtt || !todayAtt.present;
    });

    const calculatePercentage = (student) => {
        const presentCount = student.attendance.filter(a => a.present).length;
        return ((presentCount / student.attendance.length) * 100).toFixed(1);
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Absentees Today</h2>
            </div>
            <div className="dashboard-content">
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead style={{ backgroundColor: '#fef2f2' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Class</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Overall %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {absentees.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px' }}>{s.id}</td>
                                <td style={{ padding: '12px' }}>{s.firstName} {s.lastName}</td>
                                <td style={{ padding: '12px' }}>{s.classDetails}</td>
                                <td style={{ padding: '12px' }}>{calculatePercentage(s)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
