import React, { useState, useEffect } from 'react';

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: '',
    duration: '',
    status: 'Active'
  });

  useEffect(() => {
    setRoutes([
      { id: 1, name: 'Downtown Express', origin: 'Central Station', destination: 'City Hall', distance: '15 km', duration: '45 min', status: 'Active' },
      { id: 2, name: 'University Line', origin: 'Campus North', destination: 'Research Park', distance: '8 km', duration: '25 min', status: 'Active' },
      { id: 3, name: 'Airport Shuttle', origin: 'Transit Center', destination: 'International Airport', distance: '30 km', duration: '60 min', status: 'Active' },
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
    if (editingRoute) {
      setRoutes(routes.map(route => 
        route.id === editingRoute.id ? { ...formData, id: editingRoute.id } : route
      ));
      setEditingRoute(null);
    } else {
      const newRoute = {
        ...formData,
        id: routes.length > 0 ? Math.max(...routes.map(r => r.id)) + 1 : 1
      };
      setRoutes([...routes, newRoute]);
    }
    resetForm();
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      distance: route.distance,
      duration: route.duration,
      status: route.status
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setRoutes(routes.filter(route => route.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      origin: '',
      destination: '',
      distance: '',
      duration: '',
      status: 'Active'
    });
    setShowForm(false);
    setEditingRoute(null);
  };

  return (
    <div>
      <h1>Route Management</h1>
      
      {showForm ? (
        <div className="form-container">
          <h2>{editingRoute ? 'Edit Route' : 'Add New Route'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Route Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Origin</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Distance</label>
              <input
                type="text"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
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
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingRoute ? 'Update Route' : 'Add Route'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add New Route
        </button>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Route Name</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Distance</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route.id}>
                <td>{route.name}</td>
                <td>{route.origin}</td>
                <td>{route.destination}</td>
                <td>{route.distance}</td>
                <td>{route.duration}</td>
                <td>
                  <span className={`status-badge ${route.status.toLowerCase()}`}>
                    {route.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(route)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(route.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RouteManagement;