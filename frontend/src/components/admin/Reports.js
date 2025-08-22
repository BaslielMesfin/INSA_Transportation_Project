import React from 'react';

function Reports() {
  return (
    <div>
      <h1>Reports</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Monthly Report</h3>
          <p>View monthly performance</p>
        </div>
        <div className="card">
          <h3>Route Analysis</h3>
          <p>Analyze route efficiency</p>
        </div>
        <div className="card">
          <h3>Driver Performance</h3>
          <p>View driver metrics</p>
        </div>
        <div className="card">
          <h3>Financial Report</h3>
          <p>View financial data</p>
        </div>
      </div>
    </div>
  );
}

export default Reports;