import React, { useState, useEffect } from 'react';

function RouteMapping({ companies }) {
  const [routes, setRoutes] = useState([]);
  const [routeCompanies, setRouteCompanies] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    routeId: '',
    companies: []
  });
  const [newRouteForm, setNewRouteForm] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: '',
    duration: '',
    companies: []
  });

  // Initialize routes
  useEffect(() => {
    // In a real app, this would be an API call
    const initialRoutes = [
      { id: 1, name: 'Downtown Express', origin: 'Central Station', destination: 'City Hall', distance: '5 km', duration: '15 min' },
      { id: 2, name: 'University Line', origin: 'Campus North', destination: 'Research Park', distance: '8 km', duration: '25 min' },
      { id: 3, name: 'Airport Shuttle', origin: 'Transit Center', destination: 'International Airport', distance: '30 km', duration: '45 min' },
      { id: 4, name: 'City Center Loop', origin: 'Main Square', destination: 'Shopping District', distance: '6 km', duration: '20 min' },
      { id: 5, name: 'Suburban Express', origin: 'North Station', destination: 'South Terminal', distance: '25 km', duration: '40 min' },
      { id: 6, name: 'Riverfront Route', origin: 'Riverside Park', destination: 'Marina', distance: '12 km', duration: '30 min' }
    ];
    setRoutes(initialRoutes);

    // Initialize route-company mappings
    const initialRouteCompanies = {
      1: [1, 2], // Downtown Express is served by City Bus Lines and Metro Transport
      2: [1], // University Line is served by City Bus Lines only
      3: [3], // Airport Shuttle is served by Express Coaches only
      4: [1, 2], // City Center Loop is served by City Bus Lines and Metro Transport
      5: [2, 3], // Suburban Express is served by Metro Transport and Express Coaches
      6: [1, 3] // Riverfront Route is served by City Bus Lines and Express Coaches
    };
    setRouteCompanies(initialRouteCompanies);
  }, []);

  const handleAssignClick = (route) => {
    setSelectedRoute(route);
    setAssignForm({
      routeId: route.id,
      companies: routeCompanies[route.id] || []
    });
    setShowAssignModal(true);
  };

  const handleAddRouteClick = () => {
    setNewRouteForm({
      name: '',
      origin: '',
      destination: '',
      distance: '',
      duration: '',
      companies: []
    });
    setShowAddRouteModal(true);
  };

  const handleFormChange = (e, formType = 'assign') => {
    const { name, value, checked } = e.target;
    
    const setForm = formType === 'assign' ? setAssignForm : setNewRouteForm;
    
    if (name === 'companies') {
      // Handle checkbox changes
      const companyId = parseInt(value);
      setForm(prev => {
        if (checked) {
          return {
            ...prev,
            companies: [...prev.companies, companyId]
          };
        } else {
          return {
            ...prev,
            companies: prev.companies.filter(id => id !== companyId)
          };
        }
      });
    } else {
      // Handle other form changes
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveAssign = () => {
    // Update routeCompanies state
    setRouteCompanies(prev => ({
      ...prev,
      [assignForm.routeId]: assignForm.companies
    }));
    
    setShowAssignModal(false);
    setSelectedRoute(null);
  };

  const handleSaveNewRoute = () => {
    const newRouteId = routes.length > 0 ? Math.max(...routes.map(r => r.id)) + 1 : 1;
    const newRoute = {
      id: newRouteId,
      name: newRouteForm.name,
      origin: newRouteForm.origin,
      destination: newRouteForm.destination,
      distance: newRouteForm.distance,
      duration: newRouteForm.duration
    };

    setRoutes([...routes, newRoute]);
    setRouteCompanies(prev => ({
      ...prev,
      [newRouteId]: newRouteForm.companies
    }));

    setShowAddRouteModal(false);
  };

  const getCompaniesForRoute = (routeId) => {
    const companyIds = routeCompanies[routeId] || [];
    return companies
      .filter(company => companyIds.includes(company.id))
      .map(company => company.name);
  };

  return (
    <div className="route-mapping-container">
      <h1>Route - Company Mapping</h1>
      <p>View and manage which companies operate on each route</p>

      <button className="add-route-btn" onClick={handleAddRouteClick}>
        Add New Route
      </button>
      
      <div className="route-mapping-content">
        <div className="routes-list">
          <div className="list-header">
            <h2>All Routes</h2>
            <div className="route-count">
              {routes.length} routes
            </div>
          </div>
          
          <div className="route-cards">
            {routes.map(route => (
              <div key={route.id} className="route-card">
                <div className="route-header">
                  <h3>{route.name}</h3>
                  <button 
                    className="assign-btn"
                    onClick={() => handleAssignClick(route)}
                  >
                    Assign Companies
                  </button>
                </div>
                
                <div className="route-details">
                  <div className="detail-item">
                    <span className="detail-label">Origin:</span>
                    <span className="detail-value">{route.origin}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Destination:</span>
                    <span className="detail-value">{route.destination}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Distance:</span>
                    <span className="detail-value">{route.distance}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{route.duration}</span>
                  </div>
                </div>
                
                <div className="assigned-companies">
                  <h4>Assigned Companies:</h4>
                  {getCompaniesForRoute(route.id).length > 0 ? (
                    <div className="company-tags">
                      {getCompaniesForRoute(route.id).map((companyName, index) => (
                        <span key={index} className="company-tag">
                          {companyName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-companies">No companies assigned</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Companies Modal */}
      {showAssignModal && selectedRoute && (
        <div className="modal-overlay">
          <div className="modal-content assign-modal">
            <div className="modal-header">
              <h2>Assign Companies to {selectedRoute.name}</h2>
              <button className="close-modal" onClick={() => setShowAssignModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p>Select which companies should operate on this route:</p>
              
              <div className="companies-checkbox-list">
                {companies.map(company => (
                  <div key={company.id} className="checkbox-item">
                    <div className="checkbox-info">
                      <h3>{company.name}</h3>
                      <p>{company.email}</p>
                    </div>
                    <div className="checkbox-control">
                      <input
                        type="checkbox"
                        id={`company-assign-${selectedRoute.id}-${company.id}`}
                        name="companies"
                        value={company.id}
                        checked={assignForm.companies.includes(company.id)}
                        onChange={(e) => handleFormChange(e, 'assign')}
                      />
                      <label 
                        htmlFor={`company-assign-${selectedRoute.id}-${company.id}`} 
                        className={`checkbox-label ${assignForm.companies.includes(company.id) ? 'checked' : 'unchecked'}`}
                      ></label>
                      <span className={`checkbox-status ${assignForm.companies.includes(company.id) ? 'checked' : 'unchecked'}`}>
                        {assignForm.companies.includes(company.id) ? 'Assigned' : 'Not Assigned'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveAssign}>
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Route Modal */}
      {showAddRouteModal && (
        <div className="modal-overlay">
          <div className="modal-content add-route-modal">
            <div className="modal-header">
              <h2>Add New Route</h2>
              <button className="close-modal" onClick={() => setShowAddRouteModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Route Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newRouteForm.name}
                    onChange={(e) => handleFormChange(e, 'new')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Origin</label>
                  <input
                    type="text"
                    name="origin"
                    value={newRouteForm.origin}
                    onChange={(e) => handleFormChange(e, 'new')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <input
                    type="text"
                    name="destination"
                    value={newRouteForm.destination}
                    onChange={(e) => handleFormChange(e, 'new')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Distance</label>
                  <input
                    type="text"
                    name="distance"
                    value={newRouteForm.distance}
                    onChange={(e) => handleFormChange(e, 'new')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={newRouteForm.duration}
                    onChange={(e) => handleFormChange(e, 'new')}
                    required
                  />
                </div>
                <h3>Assign Companies</h3>
                <p>Select which companies should operate on this route:</p>
                <div className="companies-checkbox-list">
                  {companies.map(company => (
                    <div key={company.id} className="checkbox-item">
                      <div className="checkbox-info">
                        <h3>{company.name}</h3>
                        <p>{company.email}</p>
                      </div>
                      <div className="checkbox-control">
                        <input
                          type="checkbox"
                          id={`company-new-${company.id}`}
                          name="companies"
                          value={company.id}
                          checked={newRouteForm.companies.includes(company.id)}
                          onChange={(e) => handleFormChange(e, 'new')}
                        />
                        <label 
                          htmlFor={`company-new-${company.id}`} 
                          className={`checkbox-label ${newRouteForm.companies.includes(company.id) ? 'checked' : 'unchecked'}`}
                        ></label>
                        <span className={`checkbox-status ${newRouteForm.companies.includes(company.id) ? 'checked' : 'unchecked'}`}>
                          {newRouteForm.companies.includes(company.id) ? 'Assigned' : 'Not Assigned'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddRouteModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveNewRoute}>
                Save New Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteMapping;