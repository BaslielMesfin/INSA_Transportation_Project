// src/components/auth/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
        
        <div className="registration-info">
          <h3>Company Registration Process</h3>
          <p>New companies must register in person at our headquarters.</p>
          <p>After physical registration, a superadmin will create your admin account.</p>
          <p>You will receive your login credentials via email once your account is created.</p>
        </div>
        
        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <p>Admin: admin@citybus.com / admin</p>
          <p>Super Admin: superadmin@system.com / superadmin</p>
        </div>
      </div>
    </div>
  );
}

export default Login;