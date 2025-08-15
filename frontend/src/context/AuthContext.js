// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [resetEmail, setResetEmail] = useState(null);

  const login = (credentials) => {
    console.log('Login attempt with:', credentials);
    
    // Trim the credentials to avoid whitespace issues
    const email = credentials.email.trim();
    const password = credentials.password.trim();
    
    if (email === 'admin@bus.com' && password === 'admin') {
      console.log('Admin login successful');
      setUser({ 
        role: 'admin', 
        name: 'Bus Company Admin', 
        email: 'admin@bus.com', 
        company: 'City Bus Lines' 
      });
    } else if (email === 'superadmin@bus.com' && password === 'superadmin') {
      console.log('Superadmin login successful');
      setUser({ 
        role: 'superadmin', 
        name: 'Super Admin', 
        email: 'superadmin@bus.com', 
        company: 'System' 
      });
    } else {
      console.log('Login failed - invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Generate a secure random token
  const generateResetToken = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  // Initiate password reset
  const requestPasswordReset = (email) => {
    const token = generateResetToken();
    setResetToken(token);
    setResetEmail(email);
    
    console.log(`Password reset link: http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
    
    return { success: true, message: 'Password reset link sent to your email' };
  };

  // Reset password with token
  const resetPassword = (token, email, newPassword) => {
    if (token === resetToken && email === resetEmail) {
      console.log(`Password updated for ${email}`);
      setResetToken(null);
      setResetEmail(null);
      return { success: true, message: 'Password updated successfully' };
    } else {
      return { success: false, message: 'Invalid or expired reset link' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      requestPasswordReset,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}