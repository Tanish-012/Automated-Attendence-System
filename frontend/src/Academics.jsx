import { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAppStore } from './context/AppDataContext';
import './Dashboard.css';
import './Academics.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Academics = () => {
    const { data } = useAppStore();
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Helper function to get class averages
    const getClassAverages = (classStudents) => {
        if (!classStudents || classStudents.length === 0) return {};
        const subjectTotals = {};
        const subjectCounts = {};

        classStudents.forEach(student => {
            Object.entries(student.marks).forEach(([subject, mark]) => {
                subjectTotals[subject] = (subjectTotals[subject] || 0) + mark;
                subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
            });
        });

        const averages = {};
        Object.keys(subjectTotals).forEach(subject => {
            averages[subject] = parseFloat((subjectTotals[subject] / subjectCounts[subject]).toFixed(1));
        });
        return averages;
    };

    if (selectedStudent) {
        const classStudents = data.students.filter(s => s.classDetails === selectedClass.id);
        const classAverages = getClassAverages(classStudents);

        const chartData = Object.entries(selectedStudent.marks).map(([subject, mark]) => ({
            subject,
            StudentMark: mark,
            ClassAverage: classAverages[subject] || 0
        }));

        return (
            <div className="page-container academics-container">
                <div className="page-header">
                    <div>
                        <h2>📊 Academic Report: {selectedStudent.firstName} {selectedStudent.lastName}</h2>
                        <p>Detailed performance metrics versus class average.</p>
                    </div>
                    <button className="secondary-btn" onClick={() => setSelectedStudent(null)}>
                        <ArrowLeft size={18} /> Back to Class
                    </button>
                </div>

                <div className="colorful-grid">
                    {Object.entries(selectedStudent.marks).map(([subject, mark], index) => {
                        const isBelowAverage = mark < (classAverages[subject] || 0);
                        const gradients = ['purple-gradient', 'orange-gradient', 'green-gradient', 'red-gradient'];
                        const gradientClass = gradients[index % gradients.length];

                        return (
                            <div key={subject} className={`colorful-card ${gradientClass}`}>
                                <h3>{subject} {isBelowAverage && <span style={{ fontSize: '0.7em', padding: '2px 6px', background: 'rgba(255,0,0,0.5)', borderRadius: '10px', marginLeft: '5px' }}>Below Avg</span>}</h3>
                                <h2>{mark}%</h2>
                                <div className="stat-trend">Class Average: {classAverages[subject]}%</div>
                            </div>
                        );
                    })}
                </div>

                <div className="chart-container">
                    <h3 style={{ marginBottom: '20px' }}>Student Performance vs Class Average</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                            <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="StudentMark" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Student's Marks" />
                            <Bar dataKey="ClassAverage" fill="#10b981" radius={[6, 6, 0, 0]} name="Class Average" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (selectedClass) {
        const classStudents = data.students.filter(s => s.classDetails === selectedClass.id);
        const classAverages = getClassAverages(classStudents);

        // overall class average across all subjects
        const overallAverage = classStudents.length > 0
            ? (Object.values(classAverages).reduce((a, b) => a + b, 0) / Object.keys(classAverages).length).toFixed(1)
            : 0;

        // Determine gradients based on average for visual appeal
        const gradients = ['purple-gradient', 'orange-gradient', 'green-gradient', 'red-gradient'];

        return (
            <div className="page-container academics-container">
                <div className="page-header">
                    <div>
                        <h2>📊 Performance: Class {selectedClass.id}</h2>
                        <p>Subject wise breakdown & student list.</p>
                    </div>
                    <button className="secondary-btn" onClick={() => setSelectedClass(null)}>
                        <ArrowLeft size={18} /> Back to Classes
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <h3>Subject Averages</h3>
                    <div style={{ background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: '600' }}>
                        Overall Average: {overallAverage}%
                    </div>
                </div>
                <div className="colorful-grid">
                    {Object.entries(classAverages).map(([subject, avg], index) => (
                        <div key={subject} className={`colorful-card ${gradients[index % gradients.length]}`}>
                            <h3>{subject}</h3>
                            <h2>{avg}%</h2>
                            <div className="stat-trend">Based on {classStudents.length} students</div>
                        </div>
                    ))}
                </div>

                <div className="content-card" style={{ padding: '0px', marginTop: '30px', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                    <h3 style={{ marginBottom: '15px' }}>Students Action List</h3>
                    <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '10px' }}>
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Overall Avg</th>
                                    <th>Status (Below Average in Subject)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classStudents.map(student => {
                                    const marksValues = Object.values(student.marks);
                                    const avg = (marksValues.reduce((a, b) => a + b, 0) / marksValues.length).toFixed(1);

                                    // Check which subjects are below class average
                                    const belowAverageSubjects = Object.entries(student.marks)
                                        .filter(([subject, mark]) => mark < classAverages[subject])
                                        .map(([subject]) => subject);

                                    return (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td style={{ fontWeight: '500' }}>{student.firstName} {student.lastName}</td>
                                            <td><span style={{ fontWeight: 'bold', color: avg >= 75 ? '#10b981' : avg < 50 ? '#f5f5f5ff' : 'inherit' }}>{avg}%</span></td>
                                            <td>
                                                {belowAverageSubjects.length > 0 ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                        {belowAverageSubjects.map(subj => (
                                                            <span key={subj} className="extra-class-badge">
                                                                Extra Class: {subj}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '500' }}>On Track ✨</span>
                                                )}
                                            </td>
                                            <td>
                                                <button className="primary-btn" onClick={() => setSelectedStudent(student)} style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}>View Details</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container academics-container">
            <div className="page-header">
                <div>
                    <h2>📊 Academic Tracker</h2>
                    <p>Select a class to view detailed performance metrics.</p>
                </div>
            </div>

            <div className="colorful-grid">
                {data.classes.map((c, index) => {
                    const classStudents = data.students.filter(s => s.classDetails === c.id);
                    let totalAvg = 0;
                    if (classStudents.length > 0) {
                        const allMarks = classStudents.flatMap(s => Object.values(s.marks));
                        totalAvg = (allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(1);
                    }

                    // Alternate gradient colors for cards
                    const gradients = ['purple-gradient', 'orange-gradient', 'green-gradient', 'red-gradient'];
                    const gradientClass = gradients[index % gradients.length];

                    return (
                        <div key={c.id} className={`colorful-card ${gradientClass}`} onClick={() => setSelectedClass(c)}>
                            <h3 style={{ margin: '0' }}><BookOpen size={20} /> Class {c.id}</h3>
                            <h2 style={{ fontSize: '3rem', margin: '10px 0' }}>{totalAvg}%</h2>
                            <div className="stat-trend" style={{ fontSize: '1rem', fontWeight: '500' }}>Overall Average</div>
                            <div className="stat-trend" style={{ marginTop: '8px', opacity: 0.7 }}>{classStudents.length} Students Enrolled</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Academics;
