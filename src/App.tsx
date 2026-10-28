import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicHome } from './pages/public/PublicHome';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicHome />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Portal */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
