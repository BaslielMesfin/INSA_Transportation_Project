import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CompanyManagement from './superadmin/CompanyManagement';
import SystemAnalytics from './superadmin/SystemAnalytics';
import UserManagement from './superadmin/UserManagement';
import SystemSettings from './superadmin/SystemSettings';
import RegistrationProcess from './superadmin/RegistrationProcess';
import BusTracking from './superadmin/BusTracking';
import RouteMapping from './superadmin/RouteMapping';

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
  const [companies, setCompanies] = useState([]);
  const [buses, setBuses] = useState([]);

  // Initialize companies data
  useEffect(() => {
    // In a real app, this would be an API call
    const initialCompanies = [
      { id: 1, name: 'City Bus Lines', email: 'contact@citybus.com', phone: '555-1234', address: '123 Main St', registrationStatus: 'Completed', registrationDate: '2023-01-15', status: 'Active' },
      { id: 2, name: 'Metro Transport', email: 'info@metro.com', phone: '555-5678', address: '456 Oak Ave', registrationStatus: 'Completed', registrationDate: '2023-02-20', status: 'Active' },
      { id: 3, name: 'Express Coaches', email: 'support@express.com', phone: '555-9012', address: '789 Pine Rd', registrationStatus: 'Pending', registrationDate: '2023-03-10', status: 'Inactive' },
    ];
    setCompanies(initialCompanies);
    
    // Initialize buses data
    const initialBuses = [
      {
        id: 1,
        name: 'Bus 001',
        route: 'Downtown Express',
        driver: 'John Smith',
        capacity: 45,
        company: 'City Bus Lines',
        currentLocation: [40.7128, -74.0060],
        routePath: [
          [40.7128, -74.0060],
          [40.7138, -74.0070],
          [40.7148, -74.0080],
          [40.7158, -74.0090],
          [40.7168, -74.0100],
        ],
        status: 'Active',
        speed: 45,
        nextStop: 'Central Station',
        eta: '10 mins',
      },
      {
        id: 2,
        name: 'Bus 002',
        route: 'University Line',
        driver: 'Sarah Johnson',
        capacity: 50,
        company: 'City Bus Lines',
        currentLocation: [40.7228, -74.0160],
        routePath: [
          [40.7228, -74.0160],
          [40.7238, -74.0170],
          [40.7248, -74.0180],
          [40.7258, -74.0190],
        ],
        status: 'Active',
        speed: 35,
        nextStop: 'Campus North',
        eta: '15 mins',
      },
      {
        id: 3,
        name: 'Bus 003',
        route: 'Airport Shuttle',
        driver: 'Michael Brown',
        capacity: 55,
        company: 'Metro Transport',
        currentLocation: [40.7328, -74.0260],
        routePath: [
          [40.7328, -74.0260],
          [40.7338, -74.0270],
          [40.7348, -74.0280],
        ],
        status: 'Active',
        speed: 40,
        nextStop: 'Airport Terminal',
        eta: '20 mins',
      },
      {
        id: 4,
        name: 'Bus 004',
        route: 'City Center Loop',
        driver: 'Emily Davis',
        capacity: 40,
        company: 'Metro Transport',
        currentLocation: [40.7428, -74.0360],
        routePath: [
          [40.7428, -74.0360],
          [40.7438, -74.0370],
          [40.7448, -74.0380],
        ],
        status: 'Maintenance',
        speed: 0,
        nextStop: 'N/A',
        eta: 'N/A',
      },
      {
        id: 5,
        name: 'Bus 005',
        route: 'Suburban Express',
        driver: 'David Wilson',
        capacity: 60,
        company: 'Express Coaches',
        currentLocation: [40.7528, -74.0460],
        routePath: [
          [40.7528, -74.0460],
          [40.7538, -74.0470],
          [40.7548, -74.0480],
        ],
        status: 'Active',
        speed: 50,
        nextStop: 'Suburban Mall',
        eta: '25 mins',
      },
    ];
    setBuses(initialBuses);
  }, []);

  // Update active section when URL changes
  React.useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentSection = pathSegments[pathSegments.length - 1] || 'home';
    setActiveSection(currentSection);
  }, [location]);

  const renderContent = () => {
    switch (activeSection) {
      case 'companies':
        return <CompanyManagement companies={companies} setCompanies={setCompanies} />;
      case 'users':
        return <UserManagement />;
      case 'registration-process':
        return <RegistrationProcess />;
      case 'bus-tracking':
        return <BusTracking companies={companies} buses={buses} />;
      case 'route-mapping':
        return <RouteMapping companies={companies} />;
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
                to="/superadmin/route-mapping" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Route Mapping
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/superadmin/bus-tracking" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Bus Tracking
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
              {activeSection === 'route-mapping' && 'Route - Company Mapping'}
              {activeSection === 'bus-tracking' && 'Real-time Bus Tracking'}
              {activeSection === 'registration-process' && 'Registration Process'}
              {activeSection === 'analytics' && 'System Analytics'}
              {activeSection === 'settings' && 'System Settings'}
            </h1>
          </div>
          
          <div className="quick-nav">
            <span>Quick Navigation:</span>
            <NavLink to="/superadmin/companies">Companies</NavLink>
            <NavLink to="/superadmin/users">Accounts</NavLink>
            <NavLink to="/superadmin/route-mapping">Route Mapping</NavLink>
            <NavLink to="/superadmin/bus-tracking">Bus Tracking</NavLink>
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
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <NavLink to="/superadmin/companies" className="action-btn">
            Manage Companies
          </NavLink>
          <NavLink to="/superadmin/users" className="action-btn">
            Manage Admins
          </NavLink>
          <NavLink to="/superadmin/route-mapping" className="action-btn">
            Route Mapping
          </NavLink>
          <NavLink to="/superadmin/bus-tracking" className="action-btn">
            Track Buses
          </NavLink>
          <NavLink to="/superadmin/analytics" className="action-btn">
            View Analytics
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;