import React, { useState, useEffect } from 'react';

function PassengerManagement() {
  const [passengers, setPassengers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  useEffect(() => {
    setPassengers([
      { id: 1, name: 'Abebe Bekele', email: 'abebe@example.com', phone: '0911223344', status: 'Active' },
      { id: 2, name: 'Marta Solomon', email: 'marta@example.com', phone: '0922334455', status: 'Active' },
      { id: 3, name: 'Kebede Haile', email: 'kebede@example.com', phone: '0933445566', status: 'Blocked' },
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
    if (editingPassenger) {
      setPassengers(passengers.map(passenger => 
        passenger.id === editingPassenger.id ? { ...formData, id: editingPassenger.id } : passenger
      ));
      setEditingPassenger(null);
    } else {
      const newPassenger = {
        ...formData,
        id: passengers.length > 0 ? Math.max(...passengers.map(p => p.id)) + 1 : 1
      };
      setPassengers([...passengers, newPassenger]);
    }
    resetForm();
  };

  const handleEdit = (passenger) => {
    setEditingPassenger(passenger);
    setFormData({
      name: passenger.name,
      email: passenger.email,
      phone: passenger.phone,
      status: passenger.status
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setPassengers(passengers.filter(passenger => passenger.id !== id));
  };

  const handleToggleStatus = (id) => {
    setPassengers(passengers.map(passenger => 
      passenger.id === id ? { ...passenger, status: passenger.status === 'Active' ? 'Blocked' : 'Active' } : passenger
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'Active'
    });
    setShowForm(false);
    setEditingPassenger(null);
  };

  return (
    <div>
      <h1>Passenger Management</h1>
      
      {showForm ? (
        <div className="form-container">
          <h2>{editingPassenger ? 'Edit Passenger' : 'Add New Passenger'}</h2>
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
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingPassenger ? 'Update Passenger' : 'Add Passenger'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add New Passenger
        </button>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {passengers.map(passenger => (
              <tr key={passenger.id}>
                <td>{passenger.name}</td>
                <td>{passenger.email}</td>
                <td>{passenger.phone}</td>
                <td>
                  <span className={`status-badge ${passenger.status.toLowerCase()}`}>
                    {passenger.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(passenger)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(passenger.id)} className="delete-btn">Delete</button>
                  <button onClick={() => handleToggleStatus(passenger.id)} className="status-btn">
                    {passenger.status === 'Active' ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PassengerManagement;