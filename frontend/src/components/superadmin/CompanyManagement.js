import React, { useState } from 'react';

// Define country codes
const countryCodes = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  { code: '+254', country: 'Kenya' },
];

// Define available features
const availableFeatures = [
  { id: 'bus_management', name: 'Bus Management', description: 'Add, edit, and manage buses' },
  { id: 'route_management', name: 'Route Management', description: 'Create and manage bus routes' },
  { id: 'driver_management', name: 'Driver Management', description: 'Manage driver information' },
  { id: 'schedule_management', name: 'Schedule Management', description: 'Create and manage bus schedules' },
  { id: 'analytics', name: 'Analytics', description: 'View company performance analytics' },
  { id: 'reports', name: 'Reports', description: 'Generate and view reports' }
];

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

function CompanyManagement({ companies, setCompanies, buses }) {
  const [showForm, setShowForm] = useState(false);
  const [showFeatures, setShowFeatures] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingCompany, setPendingCompany] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+254', // Default to Kenya based on your timezone (EAT)
    address: '',
    registrationStatus: 'Pending',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return; // Allow only digits
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPhone = `${formData.countryCode}${formData.phone}`;
    const companyData = {
      ...formData,
      phone: fullPhone
    };

    // New registration: Generate OTP and show verification form
    const otp = generateOTP();
    setGeneratedOtp(otp);
    setPendingCompany(companyData);
    
    // Simulate sending OTP (replace with backend API call later)
    console.log(`Simulated email sent to ${formData.email} with OTP: ${otp}`);
    alert(`Simulated email sent to ${formData.email}. OTP: ${otp} (Check console for OTP)`);
    
    // Show OTP verification form
    setShowOtpForm(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      // OTP is correct, complete registration
      const newCompany = {
        ...pendingCompany,
        id: companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1,
        enabledFeatures: availableFeatures.map(feature => feature.id),
      };
      setCompanies([...companies, newCompany]);
      alert('OTP verified! Company registered successfully.');
      setShowOtpForm(false);
      setOtp('');
      setPendingCompany(null);
      setGeneratedOtp('');
      resetForm();
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      countryCode: '+254',
      address: '',
      registrationStatus: 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setShowForm(false);
    setShowOtpForm(false);
    setOtp('');
    setPendingCompany(null);
    setGeneratedOtp('');
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

  const openFeaturesModal = (company) => {
    setShowFeatures(company);
  };

  const getBusCount = (companyName) => {
    return buses.filter(bus => bus.company === companyName).length;
  };

  // Define common button styles as a constant
  const buttonStyles = {
    padding: '8px 12px',
    width: '120px',
    textAlign: 'center',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#163162', // Light blue color
    transition: 'background-color 0.2s'
  };

  // Define hover styles (handled via CSS in a stylesheet or pseudo-classes)
  // Note: Inline styles can't handle :hover, so you may need to add CSS for hover effects or use a library

  return (
    <div>
      <h1>Company Management</h1>
      <p>Register companies that have completed physical registration at headquarters</p>
      
      {showForm && !showOtpForm ? (
        <div className="form-container">
          <h2>Register New Company</h2>
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
            <div className="form-group phone-group">
              <label>Phone</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  style={{ width: '100px' }}
                >
                  {countryCodes.map(({ code, country }) => (
                    <option key={code} value={code}>
                      {code} ({country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>
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
                Register Company
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : showOtpForm ? (
        <div className="form-container">
          <h2>Verify OTP</h2>
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit OTP"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Verify OTP</button>
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
              <th>Number of Buses</th>
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
                <td>{getBusCount(company.name)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => openFeaturesModal(company)}
                      style={buttonStyles}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#ADD8E6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#163162'} 
                    >
                      Features
                    </button>
                    {company.registrationStatus === 'Pending' ? (
                      <button
                        onClick={() => updateRegistrationStatus(company.id, 'Completed')}
                        style={buttonStyles}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#ADD8E6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#163162'}
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <button
                        onClick={() => updateRegistrationStatus(company.id, 'Pending')}
                        style={buttonStyles}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#ADD8E6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#163162'}
                      >
                        Mark Pending
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(company.id)}
                      style={buttonStyles}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'red'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#163162'}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                            id={`feature-${showFeatures.id}-${feature.id}`}
                            checked={isEnabled}
                            onChange={() => toggleFeature(showFeatures.id, feature.id)}
                          />
                          <label 
                            htmlFor={`feature-${showFeatures.id}-${feature.id}`}
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