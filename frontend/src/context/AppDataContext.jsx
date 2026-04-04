import React, { createContext, useContext, useState, useEffect } from 'react';

const AppDataContext = createContext();

// Helper functions for random generation
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Rayaan', 'Krishna', 'Ishan', 'Shaurya', 'Diya', 'Ananya', 'Aaradhya', 'Saanvi', 'Pari', 'Kavya', 'Aditi', 'Riya', 'Avni', 'Khushi'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Das', 'Roy', 'Jha', 'Mishra'];
const addresses = ['Sector 1, Delhi', 'MG Road, Bangalore', 'Andheri, Mumbai', 'Salt Lake, Kolkata', 'Banjara Hills, Hyderabad', 'Koramangala, Bangalore', 'Vasant Kunj, Delhi'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateSystemData = () => {
  let studentIdCounter = 1000;
  let staffIdCounter = 100;
  
  const classes = [];
  const students = [];
  const subjects = ['Math', 'Science', 'English', 'History', 'Geography'];
  
  // Create Staff
  const staffs = Array.from({ length: 60 }).map(() => ({
    id: `STF${staffIdCounter++}`,
    name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
    subject: randomItem(subjects),
    assignedClass: null, // Will assign randomly
    timetable: [], // Staff timetable
    status: randomInt(1, 100) > 90 ? 'emergency' : 'active'
  }));

  // Create Classes 4 to 10
  const sections = ['A', 'B', 'C'];
  
  for (let grade = 4; grade <= 10; grade++) {
    sections.forEach(section => {
      const classId = `${grade}${section}`;
      classes.push({
        id: classId,
        grade,
        section,
        teachers: [] // Assigned later
      });
      
      const numStudents = randomInt(30, 40);
      for (let i = 0; i < numStudents; i++) {
        const joinYear = 2026 - (grade - randomInt(0, 2));
        const s = {
          id: `STU${studentIdCounter++}`,
          firstName: randomItem(firstNames),
          lastName: randomItem(lastNames),
          address: randomItem(addresses),
          parentName: `${randomItem(firstNames)} ${randomItem(lastNames)} (Parent)`,
          parentNumber: `+91 ${randomInt(9000000000, 9999999999)}`,
          yearOfJoining: joinYear,
          classDetails: classId,
          marks: subjects.reduce((acc, sub) => {
             acc[sub] = randomInt(40, 100);
             return acc;
          }, {}),
          attendance: Array.from({ length: 30 }).map((_, idx) => ({
            day: idx + 1,
            present: randomInt(1, 100) <= 90 // 90% chance present
          }))
        };
        students.push(s);
      }
    });
  }

  // Assign staff to classes randomly
  classes.forEach(c => {
    // assign 3 random staffs per class just for context
    for(let i=0; i<3; i++) {
       const staffIdx = randomInt(0, staffs.length - 1);
       staffs[staffIdx].assignedClass = c.id;
       if (!c.teachers.includes(staffs[staffIdx].name)) {
         c.teachers.push(staffs[staffIdx].name);
       }
    }
  });

  // Calculate quick stats
  let totalPresent = 0;
  let totalAbsent = 0;
  const todayDay = 30; // simulate today is day 30

  students.forEach(s => {
      const todayAtt = s.attendance.find(a => a.day === todayDay);
      if (todayAtt && todayAtt.present) totalPresent++;
      else totalAbsent++;
  });

  // Emergencies
  const emergencies = staffs
    .filter(s => s.status === 'emergency')
    .map((s, idx) => ({
      id: `EM${idx}`,
      staffName: s.name,
      staffId: s.id,
      date: new Date().toLocaleDateString(),
      details: 'Health issue / Leave',
      resolved: false
    }));

  return { classes, students, staffs, emergencies, stats: { todayDay, totalPresent, totalAbsent } };
};

export const AppDataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Try to load from localStorage first to maintain state during reloads
    const saved = localStorage.getItem('ruralAttendanceContext');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      const initialData = generateSystemData();
      setData(initialData);
      localStorage.setItem('ruralAttendanceContext', JSON.stringify(initialData));
    }
  }, []);

  const updateData = (newData) => {
    setData(newData);
    localStorage.setItem('ruralAttendanceContext', JSON.stringify(newData));
  };

  const addStudent = (studentDetails) => {
    const updated = { ...data };
    updated.students.push({
      ...studentDetails,
      id: `STU${Date.now()}`,
      attendance: Array.from({ length: 30 }).map((_, idx) => ({
        day: idx + 1,
        present: true
      }))
    });
    updateData(updated);
  };

  const resolveEmergency = (emergencyId) => {
      const updated = { ...data };
      updated.emergencies = updated.emergencies.filter(e => e.id !== emergencyId);
      updateData(updated);
  };

  const assignDuty = (emergencyId, substituteId) => {
      // Simply resolve it here for logic, but keep UI separate
      resolveEmergency(emergencyId);
  };

  if (!data) return <div>Loading Application Data...</div>;

  return (
    <AppDataContext.Provider value={{
      data,
      updateData,
      addStudent,
      resolveEmergency,
      assignDuty
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppStore = () => useContext(AppDataContext);
