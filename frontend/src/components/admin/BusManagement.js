import React, { useState, useEffect } from 'react';

function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    capacity: '',
    status: 'Active'
  });

  // Initialize with sample data
  useEffect(() => {
    setBuses([
      { id: 1, plate: 'ABC123', model: 'Mercedes-Benz', capacity: 45, status: 'Active' },
      { id: 2, plate: 'XYZ789', model: 'Volvo', capacity: 50, status: 'Active' },
      { id: 3, plate: 'DEF456', model: 'Scania', capacity: 55, status: 'Maintenance' },
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
    if (editingBus) {
      // Update existing bus
      setBuses(buses.map(bus => 
        bus.id === editingBus.id ? { ...formData, id: editingBus.id } : bus
      ));
      setEditingBus(null);
    } else {
      // Add new bus
      const newBus = {
        ...formData,
        id: buses.length > 0 ? Math.max(...buses.map(b => b.id)) + 1 : 1
      };
      setBuses([...buses, newBus]);
    }
    resetForm();
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      plate: bus.plate,
      model: bus.model,
      capacity: bus.capacity,
      status: bus.status
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setBuses(buses.filter(bus => bus.id !== id));
  };

  const resetForm = () => {
    setFormData({
      plate: '',
      model: '',
      capacity: '',
      status: 'Active'
    });
    setShowForm(false);
    setEditingBus(null);
  };

  return (
    <div>
      <h1>Bus Management</h1>
      
      {showForm ? (
        <div className="form-container">
          <h2>{editingBus ? 'Edit Bus' : 'Add New Bus'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Plate Number</label>
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
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
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingBus ? 'Update Bus' : 'Add Bus'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add New Bus
        </button>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Plate Number</th>
              <th>Model</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id}>
                <td>{bus.plate}</td>
                <td>{bus.model}</td>
                <td>{bus.capacity}</td>
                <td>
                  <span className={`status-badge ${bus.status.toLowerCase()}`}>
                    {bus.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(bus)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(bus.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusManagement;