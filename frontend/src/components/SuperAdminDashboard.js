// src/components/SuperAdminDashboard.js
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CompanyManagement from './superadmin/CompanyManagement';
import SystemAnalytics from './superadmin/SystemAnalytics';
import UserManagement from './superadmin/UserManagement';
import SystemSettings from './superadmin/SystemSettings';
import RegistrationProcess from './superadmin/RegistrationProcess';

const Breadcrumbs = ({ section }) => {
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    if (section === 'home') {
      breadcrumbs.push({ name: 'Dashboard Home', path: '/superadmin' });
    } else {
      breadcrumbs.push({ name: 'Dashboard Home', path: '/superadmin' });
      breadcrumbs.push({ 
        name: section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' '), 
        path: `/superadmin/${section}` 
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

function SuperAdminDashboard({ section = 'home' }) {
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
      case 'companies':
        return <CompanyManagement />;
      case 'users':
        return <UserManagement />;
      case 'registration-process':
        return <RegistrationProcess />;
      case 'analytics':
        return <SystemAnalytics />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Super Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <NavLink 
                to="/superadmin" 
                end
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Dashboard Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/superadmin/companies" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Company Management
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/superadmin/users" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                SuperAdmin Account Management
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/superadmin/registration-process" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Registration Process
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/superadmin/analytics" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                System Analytics
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/superadmin/settings" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                System Settings
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
              {activeSection === 'home' && 'Super Admin Dashboard'}
              {activeSection === 'companies' && 'Company Management'}
              {activeSection === 'users' && 'SuperAdmin Account Management'}
              {activeSection === 'registration-process' && 'Registration Process'}
              {activeSection === 'analytics' && 'System Analytics'}
              {activeSection === 'settings' && 'System Settings'}
            </h1>
          </div>
          
          <div className="quick-nav">
            <span>Quick Navigation:</span>
            <NavLink to="/superadmin/companies">Companies</NavLink>
            <NavLink to="/superadmin/users">Accounts</NavLink>
            <NavLink to="/superadmin/analytics">Analytics</NavLink>
            <NavLink to="/superadmin/settings">Settings</NavLink>
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
          <h3>Registered Companies</h3>
          <p>8</p>
        </div>
        <div className="card">
          <h3>Pending Registrations</h3>
          <p>3</p>
        </div>
        <div className="card">
          <h3>Total Buses</h3>
          <p>142</p>
        </div>
        <div className="card">
          <h3>Active SuperAdmins</h3>
          <p>5</p>
        </div>
        <div className="card">
          <h3>System Alerts</h3>
          <p>3</p>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;