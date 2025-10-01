import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useLocation, Navigate } from 'react-router-dom';
import BusManagement from './admin/BusManagement';
import RouteManagement from './admin/RouteManagement';
import DriverManagement from './admin/DriverManagement';
import ScheduleManagement from './admin/ScheduleManagement';
import PassengerManagement from './admin/PassengerManagement';
import FeedbackManagement from './admin/FeedbackManagement';
import NotificationManagement from './admin/NotificationManagement';
import CompanyAnalytics from './admin/CompanyAnalytics';
import Reports from './admin/Reports';
import { useAuth } from '../context/AuthContext';

const Breadcrumbs = ({ section }) => {
  const sectionTitles = {
    home: 'Dashboard Home',
    buses: 'Bus Management',
    routes: 'Route Management',
    drivers: 'Driver Management',
    schedules: 'Schedule Management',
    passengers: 'Passenger Management',
    feedback: 'Feedback Management',
    notifications: 'Notification Management',
    analytics: 'Analytics',
    reports: 'Reports',
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'Dashboard Home', path: '/admin' }];
    if (section !== 'home') {
      breadcrumbs.push({
        name: sectionTitles[section] || section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' '),
        path: `/admin/${section}`,
      });
    }
    return breadcrumbs;
  };

  return (
    <nav className="breadcrumbs">
      {getBreadcrumbs().map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="breadcrumb-separator"> / </span>}
          <NavLink to={crumb.path} className={({ isActive }) => (isActive ? 'active' : '')}>
            {crumb.name}
          </NavLink>
        </React.Fragment>
      ))}
    </nav>
  );
};

function DashboardHome() {
  return (
    <div>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Active Buses</h3>
          <p>24</p>
        </div>
        <div className="card">
          <h3>Active Routes</h3>
          <p>12</p>
        </div>
        <div className="card">
          <h3>Drivers</h3>
          <p>18</p>
        </div>
        <div className="card">
          <h3>Schedules Today</h3>
          <p>36</p>
        </div>
        <div className="card">
          <h3>Passengers</h3>
          <p>152</p>
        </div>
        <div className="card">
          <h3>Pending Feedback</h3>
          <p>8</p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [enabledFeatures, setEnabledFeatures] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Debug user state
  useEffect(() => {
    console.log('AdminDashboard: user:', user);
  }, [user]);

  // Update active section based on URL
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentSection = pathSegments[pathSegments.length - 1] || 'home';
    setActiveSection(currentSection);
  }, [location]);

  // Set enabled features based on user role
  useEffect(() => {
    console.log('AdminDashboard: Checking user role, user:', user); // Debug log
    const role = user?.role;
    if (role === 'superadmin') {
      setEnabledFeatures([
        'bus_management',
        'route_management',
        'driver_management',
        'schedule_management',
        'passenger_management',
        'feedback_management',
        'notification_management',
        'analytics',
        'reports',
      ]);
    } else if (role === 'admin') {
      setEnabledFeatures([
        'bus_management',
        'route_management',
        'driver_management',
        'schedule_management',
        'passenger_management',
        'feedback_management',
        'notification_management',
      ]);
    } else {
      setEnabledFeatures([]);
      console.log('AdminDashboard: No valid role, setting empty features'); // Debug log
    }
  }, [user]);

  // Check authentication and set redirect flag
  useEffect(() => {
    if (!user) {
      console.log('AdminDashboard: No user, redirecting to /login'); // Debug log
      setShouldRedirect(true);
    } else {
      setShouldRedirect(false);
    }
  }, [user]);

  // Perform redirect if needed
  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    return (
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        {enabledFeatures.includes('bus_management') && (
          <Route path="buses" element={<BusManagement />} />
        )}
        {enabledFeatures.includes('route_management') && (
          <Route path="routes" element={<RouteManagement />} />
        )}
        {enabledFeatures.includes('driver_management') && (
          <Route path="drivers" element={<DriverManagement />} />
        )}
        {enabledFeatures.includes('schedule_management') && (
          <Route path="schedules" element={<ScheduleManagement />} />
        )}
        {enabledFeatures.includes('passenger_management') && (
          <Route path="passengers" element={<PassengerManagement />} />
        )}
        {enabledFeatures.includes('feedback_management') && (
          <Route path="feedback" element={<FeedbackManagement />} />
        )}
        {enabledFeatures.includes('notification_management') && (
          <Route path="notifications" element={<NotificationManagement />} />
        )}
        {enabledFeatures.includes('analytics') && (
          <Route path="analytics" element={<CompanyAnalytics />} />
        )}
        {enabledFeatures.includes('reports') && (
          <Route path="reports" element={<Reports />} />
        )}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Dashboard Home
              </NavLink>
            </li>
            {enabledFeatures.includes('bus_management') && (
              <li>
                <NavLink to="/admin/buses" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Bus Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('route_management') && (
              <li>
                <NavLink to="/admin/routes" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Route Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('driver_management') && (
              <li>
                <NavLink to="/admin/drivers" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Driver Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('schedule_management') && (
              <li>
                <NavLink to="/admin/schedules" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Schedule Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('passenger_management') && (
              <li>
                <NavLink to="/admin/passengers" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Passenger Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('feedback_management') && (
              <li>
                <NavLink to="/admin/feedback" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Feedback Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('notification_management') && (
              <li>
                <NavLink to="/admin/notifications" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Notifications
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('analytics') && (
              <li>
                <NavLink to="/admin/analytics" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Analytics
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('reports') && (
              <li>
                <NavLink to="/admin/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Reports
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <button className="logout-btn" onClick={() => logout()}>
          Logout
        </button>
      </aside>

      <div className="dashboard-content">
        <div className="content-header">
          <div>
            <Breadcrumbs section={activeSection} />
            <h1>{activeSection === 'home' ? 'Bus Company Dashboard' : (Breadcrumbs({ section: activeSection }).props.children[1]?.props?.children || 'Dashboard')}</h1>
          </div>
          <div className="quick-nav">
            <span>Quick Navigation: </span>
            {enabledFeatures.includes('bus_management') && (
              <NavLink to="/admin/buses">Buses</NavLink>
            )}
            {enabledFeatures.includes('route_management') && (
              <NavLink to="/admin/routes">Routes</NavLink>
            )}
            {enabledFeatures.includes('driver_management') && (
              <NavLink to="/admin/drivers">Drivers</NavLink>
            )}
            {enabledFeatures.includes('schedule_management') && (
              <NavLink to="/admin/schedules">Schedules</NavLink>
            )}
            {enabledFeatures.includes('passenger_management') && (
              <NavLink to="/admin/passengers">Passengers</NavLink>
            )}
            {enabledFeatures.includes('feedback_management') && (
              <NavLink to="/admin/feedback">Feedback</NavLink>
            )}
            {enabledFeatures.includes('notification_management') && (
              <NavLink to="/admin/notifications">Notifications</NavLink>
            )}
            {enabledFeatures.includes('analytics') && (
              <NavLink to="/admin/analytics">Analytics</NavLink>
            )}
            {enabledFeatures.includes('reports') && (
              <NavLink to="/admin/reports">Reports</NavLink>
            )}
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
