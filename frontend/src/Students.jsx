import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from './context/AppDataContext';
import './Students.css';

const Students = () => {
    const { data, addStudent, updateData } = useAppStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    
    // Check if the dashboard sent an Add string
    const isAddingMode = searchParams.get('action') === 'add';

    const [isAdding, setIsAdding] = useState(isAddingMode);
    const [newStudent, setNewStudent] = useState({
        firstName: '',
        lastName: '',
        address: '',
        parentName: '',
        parentNumber: '',
        yearOfJoining: new Date().getFullYear(),
        classDetails: data?.classes[0]?.id || '',
    });

    // Reset when URL changes
    useEffect(() => {
        setIsAdding(searchParams.get('action') === 'add');
    }, [searchParams]);

    const handleAddClick = () => {
        setIsAdding(true);
        setSearchParams({ action: 'add' });
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setSearchParams({});
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addStudent(newStudent);
        setIsAdding(false);
        setSearchParams({});
    };

    const handleDelete = (id) => {
        const updated = { ...data };
        updated.students = updated.students.filter(s => s.id !== id);
        updateData(updated);
    }

    const filteredStudents = data.students.filter(student => {
        const matchesName = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'all' || student.classDetails === selectedGrade;
        return matchesName && matchesGrade;
    });

    if (isAdding) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h2>👤 Add New Student</h2>
                        <p>Enter the complete details to enroll a student.</p>
                    </div>
                    <button className="secondary-btn" onClick={handleCancelAdd}><X size={18} /> Cancel</button>
                </div>
                <div className="content-card" style={{ padding: '20px' }}>
                    <form onSubmit={handleAddSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label>First Name</label>
                                <input required type="text" value={newStudent.firstName} onChange={e => setNewStudent({...newStudent, firstName: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input required type="text" value={newStudent.lastName} onChange={e => setNewStudent({...newStudent, lastName: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label>Address</label>
                                <input required type="text" value={newStudent.address} onChange={e => setNewStudent({...newStudent, address: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                            </div>
                            <div>
                                <label>Parent Name</label>
                                <input required type="text" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                            </div>
                            <div>
                                <label>Parent Number</label>
                                <input required type="text" value={newStudent.parentNumber} onChange={e => setNewStudent({...newStudent, parentNumber: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                            </div>
                            <div>
                                <label>Class & Section</label>
                                <select required value={newStudent.classDetails} onChange={e => setNewStudent({...newStudent, classDetails: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                                    {data.classes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                                </select>
                            </div>
                            <div>
                                <label>Year of Joining</label>
                                <input required type="number" value={newStudent.yearOfJoining} onChange={e => setNewStudent({...newStudent, yearOfJoining: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                            </div>
                        </div>
                        <button type="submit" className="primary-btn">Save Student</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>👥 Student Management</h2>
                    <p>Manage the real-time student directory.</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={handleAddClick}>
                        <Plus size={18} />
                        <span>Add Student</span>
                    </button>
                </div>
            </div>

            <div className="content-card">
                <div className="toolbar">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <select className="filter-select" onChange={(e) => setSelectedGrade(e.target.value)} value={selectedGrade}>
                            <option value="all">All Grades</option>
                            {data.classes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID No.</th>
                                <th>Student Name</th>
                                <th>Class</th>
                                <th>Parent Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td className="font-medium">{student.id}</td>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td><span className="badge badge-blue">{student.classDetails}</span></td>
                                    <td className="text-secondary">{student.parentName} ({student.parentNumber})</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(student.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-secondary">No students found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <span className="text-secondary">Showing {filteredStudents.length} of {data.students.length} entries</span>
                </div>
            </div>
        </div>
    );
};

export default Students;
