import React, { useState, useEffect } from 'react';

function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    route: '',
    bus: '',
    driver: '',
    departureTime: '',
    arrivalTime: '',
    status: 'Scheduled'
  });

  // Sample data for dropdowns
  const routes = [
    { id: 1, name: 'Downtown Express' },
    { id: 2, name: 'University Line' },
    { id: 3, name: 'Airport Shuttle' }
  ];

  const buses = [
    { id: 1, plate: 'ABC123' },
    { id: 2, plate: 'XYZ789' },
    { id: 3, plate: 'DEF456' }
  ];

  const drivers = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Michael Brown' }
  ];

  useEffect(() => {
    setSchedules([
      { id: 1, route: 'Downtown Express', bus: 'ABC123', driver: 'John Smith', departureTime: '08:00', arrivalTime: '08:45', status: 'Scheduled' },
      { id: 2, route: 'University Line', bus: 'XYZ789', driver: 'Sarah Johnson', departureTime: '09:15', arrivalTime: '09:40', status: 'Scheduled' },
      { id: 3, route: 'Airport Shuttle', bus: 'DEF456', driver: 'Michael Brown', departureTime: '10:30', arrivalTime: '11:30', status: 'In Transit' },
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
    if (editingSchedule) {
      setSchedules(schedules.map(schedule => 
        schedule.id === editingSchedule.id ? { ...formData, id: editingSchedule.id } : schedule
      ));
      setEditingSchedule(null);
    } else {
      const newSchedule = {
        ...formData,
        id: schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1
      };
      setSchedules([...schedules, newSchedule]);
    }
    resetForm();
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      route: schedule.route,
      bus: schedule.bus,
      driver: schedule.driver,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      status: schedule.status
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const resetForm = () => {
    setFormData({
      route: '',
      bus: '',
      driver: '',
      departureTime: '',
      arrivalTime: '',
      status: 'Scheduled'
    });
    setShowForm(false);
    setEditingSchedule(null);
  };

  return (
    <div>
      <h1>Schedule Management</h1>
      
      {showForm ? (
        <div className="form-container">
          <h2>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Route</label>
              <select
                name="route"
                value={formData.route}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Route</option>
                {routes.map(route => (
                  <option key={route.id} value={route.name}>{route.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Bus</label>
              <select
                name="bus"
                value={formData.bus}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Bus</option>
                {buses.map(bus => (
                  <option key={bus.id} value={bus.plate}>{bus.plate}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Driver</label>
              <select
                name="driver"
                value={formData.driver}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Driver</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.name}>{driver.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Departure Time</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
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
                <option value="Scheduled">Scheduled</option>
                <option value="In Transit">In Transit</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add New Schedule
        </button>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Bus</th>
              <th>Driver</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td>{schedule.route}</td>
                <td>{schedule.bus}</td>
                <td>{schedule.driver}</td>
                <td>{schedule.departureTime}</td>
                <td>{schedule.arrivalTime}</td>
                <td>
                  <span className={`status-badge ${schedule.status.toLowerCase().replace(' ', '-')}`}>
                    {schedule.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(schedule)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(schedule.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScheduleManagement;