// src/components/superadmin/UserManagement.js
import React, { useState, useEffect } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SuperAdmin',
    company: 'System',
    status: 'Active'
  });

  useEffect(() => {
    // Sample companies (only those with completed registration)
    setCompanies([
      { id: 1, name: 'City Bus Lines' },
      { id: 2, name: 'Metro Transport' },
      { id: 3, name: 'Express Coaches' }
    ]);

    // Sample users
    setUsers([
      { id: 1, name: 'Super Admin User', email: 'superadmin1@system.com', role: 'SuperAdmin', company: 'System', status: 'Active' },
      { id: 2, name: 'System Manager', email: 'manager@system.com', role: 'SuperAdmin', company: 'System', status: 'Active' },
      { id: 3, name: 'Support Admin', email: 'support@system.com', role: 'SuperAdmin', company: 'System', status: 'Inactive' },
      { id: 4, name: 'Main SuperAdmin', email: 'superadmin@bus.com', role: 'SuperAdmin', company: 'System', status: 'Active' },
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
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...formData, id: editingUser.id } : user
      ));
      setEditingUser(null);
    } else {
      const newUser = {
        ...formData,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
      };
      setUsers([...users, newUser]);
    }
    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password for security
      role: user.role,
      company: user.company,
      status: user.status
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'SuperAdmin',
      company: 'System',
      status: 'Active'
    });
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div>
      <h1>SuperAdmin Account Management</h1>
      <p>Create and manage superadmin accounts for system administration</p>
      
      {showForm ? (
        <div className="form-container">
          <h2>{editingUser ? 'Edit SuperAdmin Account' : 'Create New SuperAdmin Account'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>SuperAdmin Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password {!editingUser && '*'}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
                placeholder={editingUser ? "Leave blank to keep current password" : ""}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Company</label>
              <select
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              >
                <option value="System">System</option>
                {companies.map(company => (
                  <option key={company.id} value={company.name}>{company.name}</option>
                ))}
              </select>
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
                {editingUser ? 'Update SuperAdmin Account' : 'Create SuperAdmin Account'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Create New SuperAdmin Account
        </button>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.company}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                  <button onClick={() => toggleStatus(user.id, user.status)} className="status-btn">
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  {user.email !== 'superadmin@bus.com' && (
                    <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;