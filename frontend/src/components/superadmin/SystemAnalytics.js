import React, { useState, useEffect } from 'react';

function SystemAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalCompanies: 0,
    totalBuses: 0,
    totalDrivers: 0,
    totalRoutes: 0,
    activeSchedules: 0,
    completedTrips: 0,
    systemLoad: 'Normal'
  });

  const [companyStats, setCompanyStats] = useState([]);
  const [routeStats, setRouteStats] = useState([]);

  useEffect(() => {
    // Simulate fetching analytics data
    setAnalytics({
      totalCompanies: 8,
      totalBuses: 142,
      totalDrivers: 56,
      totalRoutes: 42,
      activeSchedules: 36,
      completedTrips: 128,
      systemLoad: 'Normal'
    });

    setCompanyStats([
      { id: 1, name: 'City Bus Lines', buses: 24, drivers: 18, routes: 12 },
      { id: 2, name: 'Metro Transport', buses: 32, drivers: 24, routes: 15 },
      { id: 3, name: 'Express Coaches', buses: 18, drivers: 14, routes: 8 },
    ]);

    setRouteStats([
      { id: 1, name: 'Downtown Express', trips: 24, avgDuration: '45 min', popularity: 'High' },
      { id: 2, name: 'University Line', trips: 18, avgDuration: '25 min', popularity: 'Medium' },
      { id: 3, name: 'Airport Shuttle', trips: 12, avgDuration: '60 min', popularity: 'High' },
    ]);
  }, []);

  return (
    <div>
      <h1>System Analytics</h1>
      
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Companies</h3>
          <p>{analytics.totalCompanies}</p>
        </div>
        <div className="card">
          <h3>Total Buses</h3>
          <p>{analytics.totalBuses}</p>
        </div>
        <div className="card">
          <h3>Total Drivers</h3>
          <p>{analytics.totalDrivers}</p>
        </div>
        <div className="card">
          <h3>Total Routes</h3>
          <p>{analytics.totalRoutes}</p>
        </div>
        <div className="card">
          <h3>Active Schedules</h3>
          <p>{analytics.activeSchedules}</p>
        </div>
        <div className="card">
          <h3>Completed Trips</h3>
          <p>{analytics.completedTrips}</p>
        </div>
        <div className="card">
          <h3>System Load</h3>
          <p>{analytics.systemLoad}</p>
        </div>
      </div>

      <div className="analytics-section">
        <h2>Company Statistics</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Buses</th>
                <th>Drivers</th>
                <th>Routes</th>
              </tr>
            </thead>
            <tbody>
              {companyStats.map(company => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.buses}</td>
                  <td>{company.drivers}</td>
                  <td>{company.routes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analytics-section">
        <h2>Route Performance</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Trips Today</th>
                <th>Avg Duration</th>
                <th>Popularity</th>
              </tr>
            </thead>
            <tbody>
              {routeStats.map(route => (
                <tr key={route.id}>
                  <td>{route.name}</td>
                  <td>{route.trips}</td>
                  <td>{route.avgDuration}</td>
                  <td>
                    <span className={`popularity-badge ${route.popularity.toLowerCase()}`}>
                      {route.popularity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analytics-section">
        <h2>System Health</h2>
        <div className="system-health">
          <div className="health-item">
            <span>Database Status:</span>
            <span className="status-healthy">Healthy</span>
          </div>
          <div className="health-item">
            <span>API Response Time:</span>
            <span>120ms</span>
          </div>
          <div className="health-item">
            <span>Active Users:</span>
            <span>24</span>
          </div>
          <div className="health-item">
            <span>System Uptime:</span>
            <span>99.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemAnalytics;