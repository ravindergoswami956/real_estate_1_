import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PublicHome } from './pages/public/PublicHome';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function HashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // If visitor lands with hash route e.g. #/admin/login or #/admin
    if (window.location.hash.startsWith('#/admin/login')) {
      navigate('/admin/login', { replace: true });
    } else if (window.location.hash.startsWith('#/admin')) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <HashRedirect />
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicHome />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Portal */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
