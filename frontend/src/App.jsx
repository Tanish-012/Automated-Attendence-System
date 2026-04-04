import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Users,
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  Utensils,
  MessageSquare,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import Dashboard from './Dashboard';
import Students from './Students';
import Attendance from './Attendance';
import Staff from './Staff';
import Emergencies from './Emergencies';
import MidDayMeals from './MidDayMeals';
import ParentComm from './ParentComm';
import Academics from './Academics';
import Login from './Login';
import Settings from './Settings';
import { StudentsDrilldown, PresentDrilldown, AbsentDrilldown } from './DrilldownViews';
import { AppDataProvider } from './context/AppDataContext';
import './index.css';

const SidebarItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
      <Icon className="sidebar-icon" size={20} />
      <span>{label}</span>
    </Link>
  );
};

const PrivateRoute = ({ children }) => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    return isAuth ? children : <Navigate to="/login" />;
};

const MainLayout = () => {
    return (
        <div className="layout">
        <nav className="sidebar">
          <div className="sidebar-header">
            <div className="logo-placeholder"></div>
            <h1>Rural EduSync</h1>
          </div>

          <div className="sidebar-nav">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/attendance" icon={CalendarDays} label="Attendance" />
            <SidebarItem to="/students" icon={Users} label="Students" />
            <SidebarItem to="/staff" icon={Users} label="Staff Duties" />
            <SidebarItem to="/emergencies" icon={Stethoscope} label="Emergencies" />
            <SidebarItem to="/meals" icon={Utensils} label="Mid-Day Meals" />
            <SidebarItem to="/communication" icon={MessageSquare} label="Parent Comm" />
            <SidebarItem to="/academics" icon={TrendingUp} label="Academics" />
          </div>

          <div className="sidebar-footer">
            <Link to="/settings" className="settings-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
              <SettingsIcon size={20} />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <header className="topbar">
            <h2>School Admin Portal</h2>
            <div className="user-profile">
              <div className="avatar">AD</div>
              <span>Tanish Kumar</span>
            </div>
          </header>

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/students" element={<Students />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/emergencies" element={<Emergencies />} />
              <Route path="/meals" element={<MidDayMeals />} />
              <Route path="/communication" element={<ParentComm />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/drilldown/students" element={<StudentsDrilldown />} />
              <Route path="/drilldown/present" element={<PresentDrilldown />} />
              <Route path="/drilldown/absent" element={<AbsentDrilldown />} />
            </Routes>
          </div>
        </main>
      </div>
    );
};

function App() {
  return (
    <AppDataProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    </AppDataProvider>
  );
}

export default App;
