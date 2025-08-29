// src/components/AdminDashboard.js
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import BusManagement from './admin/BusManagement';
import RouteManagement from './admin/RouteManagement';
import DriverManagement from './admin/DriverManagement';
import ScheduleManagement from './admin/ScheduleManagement';
import PassengerManagement from './admin/PassengerManagement';
import FeedbackManagement from './admin/FeedbackManagement';
import NotificationManagement from './admin/NotificationManagement';

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

function AdminDashboard({ section = 'home' }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(section);

  // Update active section when URL changes
  React.useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentSection = pathSegments[pathSegments.length - 1] || 'home';
    setActiveSection(currentSection);
  }, [location]);

  const renderContent = () => {
    switch (activeSection) {
      case 'buses':
        return <BusManagement />;
      case 'routes':
        return <RouteManagement />;
      case 'drivers':
        return <DriverManagement />;
      case 'schedules':
        return <ScheduleManagement />;
      case 'passengers':
        return <PassengerManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'notifications':
        return <NotificationManagement />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Dashboard Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/buses" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Bus Management
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/routes" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Route Management
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/drivers" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Driver Management
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/schedules" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Schedule Management
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/passengers" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Passenger Management
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/feedback" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Feedback Management
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/notifications" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Notifications
              </NavLink>
            </li>
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
              {activeSection === 'passengers' && 'Passenger Management'}
              {activeSection === 'feedback' && 'Feedback Management'}
              {activeSection === 'notifications' && 'Notification Management'}
            </h1>
          </div>
          
          <div className="quick-nav">
            <span>Quick Navigation:</span>
            <NavLink to="/admin/buses">Buses</NavLink>
            <NavLink to="/admin/routes">Routes</NavLink>
            <NavLink to="/admin/drivers">Drivers</NavLink>
            <NavLink to="/admin/schedules">Schedules</NavLink>
            <NavLink to="/admin/passengers">Passengers</NavLink>
            <NavLink to="/admin/feedback">Feedback</NavLink>
            <NavLink to="/admin/notifications">Notifications</NavLink>
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

export default AdminDashboard;