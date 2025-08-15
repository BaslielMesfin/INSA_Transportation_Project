import React, { useState, useEffect } from 'react';

function SystemSettings() {
  const [settings, setSettings] = useState({
    systemName: 'Bus Transport Manager',
    adminEmail: 'admin@bustransport.com',
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    enableNotifications: true,
    enableMaintenanceMode: false,
    maintenanceMessage: 'System is under maintenance. Please try again later.'
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // In a real app, you would save to a backend
    alert('Settings saved successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // In a real app, you would verify current password and update
    alert('Password changed successfully!');
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div>
      <h1>System Settings</h1>
      
      <div className="settings-container">
        <div className="settings-section">
          <h2>General Settings</h2>
          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label>System Name</label>
              <input
                type="text"
                name="systemName"
                value={settings.systemName}
                onChange={handleSettingsChange}
              />
            </div>
            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                name="adminEmail"
                value={settings.adminEmail}
                onChange={handleSettingsChange}
              />
            </div>
            <div className="form-group">
              <label>Session Timeout (minutes)</label>
              <input
                type="number"
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleSettingsChange}
              />
            </div>
            <div className="form-group">
              <label>Max Login Attempts</label>
              <input
                type="number"
                name="maxLoginAttempts"
                value={settings.maxLoginAttempts}
                onChange={handleSettingsChange}
              />
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="enableNotifications"
                checked={settings.enableNotifications}
                onChange={handleSettingsChange}
              />
              <label>Enable Email Notifications</label>
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="enableMaintenanceMode"
                checked={settings.enableMaintenanceMode}
                onChange={handleSettingsChange}
              />
              <label>Enable Maintenance Mode</label>
            </div>
            {settings.enableMaintenanceMode && (
              <div className="form-group">
                <label>Maintenance Message</label>
                <textarea
                  name="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={handleSettingsChange}
                  rows="3"
                />
              </div>
            )}
            <button type="submit" className="save-btn">Save Settings</button>
          </form>
        </div>

        <div className="settings-section">
          <h2>Security</h2>
          {!showPasswordForm ? (
            <button 
              className="change-password-btn" 
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Update Password</button>
                <button 
                  type="button" 
                  onClick={() => setShowPasswordForm(false)} 
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="settings-section">
          <h2>System Information</h2>
          <div className="system-info">
            <div className="info-item">
              <span>Version:</span>
              <span>1.2.0</span>
            </div>
            <div className="info-item">
              <span>Last Updated:</span>
              <span>2023-05-15</span>
            </div>
            <div className="info-item">
              <span>Database:</span>
              <span>PostgreSQL 14.2</span>
            </div>
            <div className="info-item">
              <span>Framework:</span>
              <span>React 18.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;