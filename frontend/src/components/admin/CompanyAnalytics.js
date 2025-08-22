import React from 'react';

function CompanyAnalytics() {
  return (
    <div>
      <h1>Company Analytics</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Trips</h3>
          <p>1,245</p>
        </div>
        <div className="card">
          <h3>Active Buses</h3>
          <p>24</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p>$42,580</p>
        </div>
        <div className="card">
          <h3>Average Rating</h3>
          <p>4.7/5</p>
        </div>
      </div>
    </div>
  );
}

export default CompanyAnalytics;