import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useLocation, Navigate } from 'react-router-dom'; // Added Navigate
import BusManagement from './admin/BusManagement';
import RouteManagement from './admin/RouteManagement';
import DriverManagement from './admin/DriverManagement';
import ScheduleManagement from './admin/ScheduleManagement';
import CompanyAnalytics from './admin/CompanyAnalytics';
import Reports from './admin/Reports';
import { useAuth } from '../context/AuthContext';

const Breadcrumbs = ({ section }) => {
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    if (section === 'home') {
      breadcrumbs.push({ name: 'Dashboard Home', path: '/admin' });
    } else {
      breadcrumbs.push({ name: 'Dashboard Home', path: '/admin' });
      breadcrumbs.push({ 
        name: section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' '), 
        path: `/admin/${section}` 
      });
    }
    
    return breadcrumbs;
  };

  return (
    <nav className="breadcrumbs">
      {getBreadcrumbs().map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          {crumb.path ? (
            <NavLink to={crumb.path}>{crumb.name}</NavLink>
          ) : (
            <span>{crumb.name}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

function AdminDashboard() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const { user } = useAuth();
  const [enabledFeatures, setEnabledFeatures] = useState([]);

  // Update active section when URL changes
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentSection = pathSegments[pathSegments.length - 1] || 'home';
    setActiveSection(currentSection);
  }, [location]);

  // Get enabled features for the logged-in admin's company
  useEffect(() => {
    // In a real app, this would be an API call to get the company's enabled features
    // For now, we'll use mock data based on the user's company
    if (user.company === 'City Bus Lines') {
      setEnabledFeatures(['bus_management', 'route_management', 'driver_management', 'schedule_management']);
    } else if (user.company === 'Metro Transport') {
      setEnabledFeatures(['bus_management', 'driver_management', 'analytics']);
    } else {
      setEnabledFeatures(['bus_management', 'route_management']);
    }
  }, [user.company]);

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
              <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
                Dashboard Home
              </NavLink>
            </li>
            {enabledFeatures.includes('bus_management') && (
              <li>
                <NavLink to="/admin/buses" className={({ isActive }) => isActive ? "active" : ""}>
                  Bus Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('route_management') && (
              <li>
                <NavLink to="/admin/routes" className={({ isActive }) => isActive ? "active" : ""}>
                  Route Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('driver_management') && (
              <li>
                <NavLink to="/admin/drivers" className={({ isActive }) => isActive ? "active" : ""}>
                  Driver Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('schedule_management') && (
              <li>
                <NavLink to="/admin/schedules" className={({ isActive }) => isActive ? "active" : ""}>
                  Schedule Management
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('analytics') && (
              <li>
                <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "active" : ""}>
                  Analytics
                </NavLink>
              </li>
            )}
            {enabledFeatures.includes('reports') && (
              <li>
                <NavLink to="/admin/reports" className={({ isActive }) => isActive ? "active" : ""}>
                  Reports
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </aside>
      
      <div className="dashboard-content">
        <div className="content-header">
          <div>
            <Breadcrumbs section={activeSection} />
            <h1>
              {activeSection === 'home' && 'Bus Company Dashboard'}
              {activeSection === 'buses' && 'Bus Management'}
              {activeSection === 'routes' && 'Route Management'}
              {activeSection === 'drivers' && 'Driver Management'}
              {activeSection === 'schedules' && 'Schedule Management'}
              {activeSection === 'analytics' && 'Analytics'}
              {activeSection === 'reports' && 'Reports'}
            </h1>
          </div>
          
          <div className="quick-nav">
            <span>Quick Navigation:</span>
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
            {enabledFeatures.includes('analytics') && (
              <NavLink to="/admin/analytics">Analytics</NavLink>
            )}
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
}

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
      </div>
    </div>
  );
}

export default AdminDashboard;