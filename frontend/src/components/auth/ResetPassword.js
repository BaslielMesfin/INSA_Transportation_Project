// src/components/auth/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Updated path

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState([]);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const feedback = [];
    
    // Length check
    if (password.length >= 8) {
      strength += 25;
    } else {
      feedback.push("At least 8 characters");
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("One uppercase letter");
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("One lowercase letter");
    }
    
    // Number check
    if (/[0-9]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("One number");
    }
    
    // Special character check (bonus)
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 10;
    }
    
    setPasswordStrength(Math.min(strength, 100));
    setPasswordFeedback(feedback);
  };

  useEffect(() => {
    if (token && email) {
      setIsValidToken(true);
    } else {
      setMessage('Invalid reset link');
    }
  }, [token, email]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    
    if (passwordStrength < 75) {
      setMessage('Please choose a stronger password');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = resetPassword(token, email, password);
      setMessage(result.message);
      
      if (result.success) {
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return '#e74c3c'; // Weak
    if (passwordStrength < 70) return '#f39c12'; // Medium
    return '#2ecc71'; // Strong
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  if (!isValidToken) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form">
          <h2>Invalid Reset Link</h2>
          <p>The password reset link is invalid or has expired.</p>
          <button 
            className="back-btn" 
            onClick={() => navigate('/forgot-password')}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Set New Password</h2>
        <p>Enter a new password for your account.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
            
            {/* Password Strength Meter */}
            {password && (
              <div className="password-strength-meter">
                <div className="strength-bar">
                  <div 
                    className="strength-indicator" 
                    style={{ 
                      width: `${passwordStrength}%`,
                      backgroundColor: getStrengthColor()
                    }}
                  ></div>
                </div>
                <div className="strength-label">
                  <span style={{ color: getStrengthColor() }}>
                    {getStrengthLabel()}
                  </span>
                  <span>{passwordStrength}%</span>
                </div>
                
                {passwordFeedback.length > 0 && (
                  <div className="password-feedback">
                    <p>Add to make your password stronger:</p>
                    <ul>
                      {passwordFeedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="password-mismatch">
                Passwords do not match
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="reset-btn" 
            disabled={isLoading || passwordStrength < 75}
          >
            {isLoading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;