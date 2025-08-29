import React, { useState, useEffect } from 'react';

function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'All Passengers',
    priority: 'Normal'
  });

  useEffect(() => {
    setNotifications([
      { 
        id: 1, 
        title: 'Route Change Alert', 
        message: 'Route 5 will be temporarily diverted due to road construction from Jan 20-25.', 
        target: 'All Passengers', 
        priority: 'High',
        date: '2024-01-18',
        status: 'Sent'
      },
      { 
        id: 2, 
        title: 'New Bus Schedule', 
        message: 'New schedule effective from February 1st. Please check the updated timings.', 
        target: 'All Passengers', 
        priority: 'Normal',
        date: '2024-01-15',
        status: 'Sent'
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
    const newNotification = {
      ...formData,
      id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0],
      status: 'Sent'
    };
    setNotifications([...notifications, newNotification]);
    resetForm();
    alert('Notification sent successfully!');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      target: 'All Passengers',
      priority: 'Normal'
    });
    setShowForm(false);
  };

  return (
    <div>
      <h1>Notification Management</h1>
      
      {showForm ? (
        <div className="form-container">
          <h2>Send New Notification</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>
            <div className="form-group">
              <label>Target Audience</label>
              <select
                name="target"
                value={formData.target}
                onChange={handleInputChange}
              >
                <option value="All Passengers">All Passengers</option>
                <option value="Specific Route">Specific Route</option>
                <option value="Drivers Only">Drivers Only</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                Send Notification
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Send New Notification
        </button>
      )}

      <div className="table-container">
        <h2>Notification History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Target</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(notification => (
              <tr key={notification.id}>
                <td>{notification.date}</td>
                <td>{notification.title}</td>
                <td>{notification.target}</td>
                <td>
                  <span className={`priority-badge ${notification.priority.toLowerCase()}`}>
                    {notification.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${notification.status.toLowerCase()}`}>
                    {notification.status}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => alert(`Message: ${notification.message}`)} 
                    className="view-btn"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleDelete(notification.id)} 
                    className="delete-btn"
                  >
                    Delete
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

export default NotificationManagement;