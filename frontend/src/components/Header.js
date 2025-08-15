import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Bus Transport Manager</h1>
      </div>
      
      <nav>
        {user && (
          <>
            <Link to={user.role === 'superadmin' ? '/superadmin' : '/admin'}>
              Dashboard
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </nav>
      
      {user && (
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <span className="role-badge">{user.role}</span>
        </div>
      )}
    </header>
  );
}

export default Header;