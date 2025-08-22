import React, { useState, useEffect } from 'react';

// Define the available features for admins
const availableFeatures = [
  { id: 'bus_management', name: 'Bus Management', description: 'Add, edit, and manage buses' },
  { id: 'route_management', name: 'Route Management', description: 'Create and manage bus routes' },
  { id: 'driver_management', name: 'Driver Management', description: 'Manage driver information' },
  { id: 'schedule_management', name: 'Schedule Management', description: 'Create and manage bus schedules' },
  { id: 'analytics', name: 'Analytics', description: 'View company performance analytics' },
  { id: 'reports', name: 'Reports', description: 'Generate and view reports' }
];

function CompanyManagement({ companies, setCompanies }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showFeatures, setShowFeatures] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationStatus: 'Pending',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCompany) {
      setCompanies(companies.map(company => 
        company.id === editingCompany.id ? { ...formData, id: editingCompany.id } : company
      ));
      setEditingCompany(null);
    } else {
      const newCompany = {
        ...formData,
        id: companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1,
        // Initialize all features as enabled for new companies
        enabledFeatures: availableFeatures.map(feature => feature.id)
      };
      setCompanies([...companies, newCompany]);
    }
    resetForm();
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      registrationStatus: company.registrationStatus,
      registrationDate: company.registrationDate,
      status: company.status
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  const updateRegistrationStatus = (id, status) => {
    setCompanies(companies.map(company => 
      company.id === id ? { ...company, registrationStatus: status } : company
    ));
  };

  const toggleFeature = (companyId, featureId) => {
    setCompanies(prevCompanies => {
      return prevCompanies.map(company => {
        if (company.id === companyId) {
          const enabledFeatures = company.enabledFeatures || [];
          const isEnabled = enabledFeatures.includes(featureId);
          
          return {
            ...company,
            enabledFeatures: isEnabled
              ? enabledFeatures.filter(id => id !== featureId)
              : [...enabledFeatures, featureId]
          };
        }
        return company;
      });
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      registrationStatus: 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setShowForm(false);
    setEditingCompany(null);
  };

  const openFeaturesModal = (company) => {
    setShowFeatures(company);
  };

  return (
    <div>
      <h1>Company Management</h1>
      <p>Register companies that have completed physical registration at headquarters</p>
      
      {showForm ? (
        <div className="form-container">
          <h2>{editingCompany ? 'Edit Company' : 'Register New Company'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Registration Date</label>
              <input
                type="date"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Registration Status</label>
              <select
                name="registrationStatus"
                value={formData.registrationStatus}
                onChange={handleInputChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Account Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingCompany ? 'Update Company' : 'Register Company'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Register New Company
        </button>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Registration Date</th>
              <th>Registration Status</th>
              <th>Account Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.email}</td>
                <td>{company.phone}</td>
                <td>{company.address}</td>
                <td>{company.registrationDate}</td>
                <td>
                  <span className={`status-badge ${company.registrationStatus.toLowerCase()}`}>
                    {company.registrationStatus}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${company.status.toLowerCase()}`}>
                    {company.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(company)} className="edit-btn">Edit</button>
                  <button onClick={() => openFeaturesModal(company)} className="features-btn">Features</button>
                  {company.registrationStatus === 'Pending' ? (
                    <button 
                      onClick={() => updateRegistrationStatus(company.id, 'Completed')} 
                      className="status-btn"
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateRegistrationStatus(company.id, 'Pending')} 
                      className="status-btn"
                    >
                      Mark Pending
                    </button>
                  )}
                  <button onClick={() => handleDelete(company.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Features Modal */}
      {showFeatures && (
        <div className="modal-overlay">
          <div className="modal-content features-modal">
            <div className="modal-header">
              <h2>Manage Features for {showFeatures.name}</h2>
              <button className="close-modal" onClick={() => setShowFeatures(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <p>Enable or disable features for this company's admin account:</p>
              
              <div className="features-list">
                {availableFeatures.map(feature => {
                  const isEnabled = showFeatures.enabledFeatures?.includes(feature.id) || false;
                  return (
                    <div key={feature.id} className="feature-item">
                      <div className="feature-info">
                        <h3>{feature.name}</h3>
                        <p>{feature.description}</p>
                      </div>
                      <div className="feature-toggle">
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            id={`feature-${feature.id}`}
                            checked={isEnabled}
                            onChange={() => toggleFeature(showFeatures.id, feature.id)}
                          />
                          <label 
                            htmlFor={`feature-${feature.id}`}
                            className={`slider round ${isEnabled ? 'enabled' : 'disabled'}`}
                          ></label>
                        </div>
                        <span className={`toggle-status ${isEnabled ? 'enabled' : 'disabled'}`}>
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="save-btn" onClick={() => setShowFeatures(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyManagement;