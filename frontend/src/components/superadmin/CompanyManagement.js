// src/components/superadmin/CompanyManagement.js
import React, { useState, useEffect } from 'react';

function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationStatus: 'Pending', // New field
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  useEffect(() => {
    // Sample companies with registration status
    setCompanies([
      { 
        id: 1, 
        name: 'City Bus Lines', 
        email: 'contact@citybus.com', 
        phone: '555-1234', 
        address: '123 Main St', 
        registrationStatus: 'Completed',
        registrationDate: '2023-01-15',
        status: 'Active' 
      },
      { 
        id: 2, 
        name: 'Metro Transport', 
        email: 'info@metro.com', 
        phone: '555-5678', 
        address: '456 Oak Ave', 
        registrationStatus: 'Completed',
        registrationDate: '2023-02-20',
        status: 'Active' 
      },
      { 
        id: 3, 
        name: 'Express Coaches', 
        email: 'support@express.com', 
        phone: '555-9012', 
        address: '789 Pine Rd', 
        registrationStatus: 'Pending',
        registrationDate: '2023-03-10',
        status: 'Inactive' 
      },
    ]);
  }, []);

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
        id: companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1
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
    </div>
  );
}

export default CompanyManagement;