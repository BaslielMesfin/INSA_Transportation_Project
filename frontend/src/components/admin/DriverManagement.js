import React, { useState, useEffect } from 'react';

function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    license: '',
    phone: '',
    email: '',
    status: 'Active'
  });

  useEffect(() => {
    setDrivers([
      { id: 1, name: 'John Smith', license: 'DL123456', phone: '555-1234', email: 'john@example.com', status: 'Active' },
      { id: 2, name: 'Sarah Johnson', license: 'DL789012', phone: '555-5678', email: 'sarah@example.com', status: 'Active' },
      { id: 3, name: 'Michael Brown', license: 'DL345678', phone: '555-9012', email: 'michael@example.com', status: 'On Leave' },
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
    if (editingDriver) {
      setDrivers(drivers.map(driver => 
        driver.id === editingDriver.id ? { ...formData, id: editingDriver.id } : driver
      ));
      setEditingDriver(null);
    } else {
      const newDriver = {
        ...formData,
        id: drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1
      };
      setDrivers([...drivers, newDriver]);
    }
    resetForm();
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      license: driver.license,
      phone: driver.phone,
      email: driver.email,
      status: driver.status
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      license: '',
      phone: '',
      email: '',
      status: 'Active'
    });
    setShowForm(false);
    setEditingDriver(null);
  };

  return (
    <div>
      <h1>Driver Management</h1>
      
      {showForm ? (
        <div className="form-container">
          <h2>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>License Number</label>
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
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
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingDriver ? 'Update Driver' : 'Add Driver'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add New Driver
        </button>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>License</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td>{driver.license}</td>
                <td>{driver.phone}</td>
                <td>{driver.email}</td>
                <td>
                  <span className={`status-badge ${driver.status.toLowerCase().replace(' ', '-')}`}>
                    {driver.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(driver)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(driver.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DriverManagement;