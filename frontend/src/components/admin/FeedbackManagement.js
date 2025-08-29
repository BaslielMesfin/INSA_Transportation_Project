import React, { useState, useEffect } from 'react';

function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    setFeedbacks([
      { 
        id: 1, 
        passenger: 'Abebe Bekele', 
        bus: 'ABC123', 
        route: 'Downtown Express', 
        rating: 4, 
        comment: 'Bus was clean and driver was polite. Good service!', 
        status: 'Resolved',
        date: '2024-01-15'
      },
      { 
        id: 2, 
        passenger: 'Marta Solomon', 
        bus: 'XYZ789', 
        route: 'University Line', 
        rating: 2, 
        comment: 'Bus arrived 20 minutes late. Very inconvenient.', 
        status: 'Pending',
        date: '2024-01-16'
      },
      { 
        id: 3, 
        passenger: 'Kebede Haile', 
        bus: 'DEF456', 
        route: 'Airport Shuttle', 
        rating: 5, 
        comment: 'Excellent service! Comfortable ride and professional driver.', 
        status: 'Resolved',
        date: '2024-01-14'
      },
    ]);
  }, []);

  const filteredFeedbacks = filter === 'All' 
    ? feedbacks 
    : feedbacks.filter(f => f.status === filter);

  const handleStatusChange = (id, newStatus) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === id ? { ...f, status: newStatus } : f
    ));
  };

  return (
    <div>
      <h1>Passenger Feedback</h1>
      
      <div className="filter-container">
        <label>Filter by status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Passenger</th>
              <th>Bus</th>
              <th>Route</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map(feedback => (
              <tr key={feedback.id}>
                <td>{feedback.date}</td>
                <td>{feedback.passenger}</td>
                <td>{feedback.bus}</td>
                <td>{feedback.route}</td>
                <td>
                  <span className="rating">
                    {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${feedback.status.toLowerCase()}`}>
                    {feedback.status}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => setSelectedFeedback(feedback)} 
                    className="view-btn"
                  >
                    View
                  </button>
                  {feedback.status === 'Pending' && (
                    <button 
                      onClick={() => handleStatusChange(feedback.id, 'Resolved')} 
                      className="resolve-btn"
                    >
                      Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFeedback && (
        <div className="modal">
          <div className="modal-content">
            <h2>Feedback Details</h2>
            <div className="feedback-details">
              <p><strong>Passenger:</strong> {selectedFeedback.passenger}</p>
              <p><strong>Date:</strong> {selectedFeedback.date}</p>
              <p><strong>Bus:</strong> {selectedFeedback.bus}</p>
              <p><strong>Route:</strong> {selectedFeedback.route}</p>
              <p><strong>Rating:</strong> {'★'.repeat(selectedFeedback.rating)}{'☆'.repeat(5 - selectedFeedback.rating)}</p>
              <p><strong>Comment:</strong> {selectedFeedback.comment}</p>
              <p><strong>Status:</strong> {selectedFeedback.status}</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setSelectedFeedback(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackManagement;