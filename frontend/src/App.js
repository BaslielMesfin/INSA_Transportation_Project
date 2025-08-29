import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {user ? (
        <>
<<<<<<< HEAD
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="buses" element={<AdminDashboard section="buses" />} />
            <Route path="routes" element={<AdminDashboard section="routes" />} />
            <Route path="drivers" element={<AdminDashboard section="drivers" />} />
            <Route path="schedules" element={<AdminDashboard section="schedules" />} />
            <Route path="passengers" element={<AdminDashboard section="passengers" />} />
            <Route path="feedback" element={<AdminDashboard section="feedback" />} />
            <Route path="notifications" element={<AdminDashboard section="notifications" />} />
            <Route path="" element={<AdminDashboard section="home" />} />
          </Route>
          
          <Route path="/superadmin" element={<SuperAdminDashboard />}>
            <Route path="bus-tracking" element={<SuperAdminDashboard section="bus-tracking" />} />
            <Route path="companies" element={<SuperAdminDashboard section="companies" />} />
            <Route path="users" element={<SuperAdminDashboard section="users" />} />
            <Route path="registration-process" element={<SuperAdminDashboard section="registration-process" />} />
            <Route path="analytics" element={<SuperAdminDashboard section="analytics" />} />
            <Route path="settings" element={<SuperAdminDashboard section="settings" />} />
            <Route path="" element={<SuperAdminDashboard section="home" />} />
          </Route>
          
=======
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/superadmin/*" element={<SuperAdminDashboard />} />
>>>>>>> e83906d9bb25a7ba71d3c28b30454a1c2d343e1c
          <Route path="/" element={<Navigate to={user.role === 'superadmin' ? '/superadmin' : '/admin'} />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;