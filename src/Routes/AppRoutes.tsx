import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from '../PUBLIC-PORTAL/Routes/Route';
import Unauthorized from '../PUBLIC-PORTAL/Pages/Unauthorized';
import { adminRoutes } from '../ADMIN-PORTAL/Routes/Route';
import { staffRoutes } from '../STAFF-PORTAL/Routes/Routes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      {publicRoutes}
      
      {/* Admin Routes - Protected for Admin User and Super Admin */}
      {adminRoutes}
      
      {/* Staff Routes - Protected for Staff only */}
      {staffRoutes}
      
      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Catch-all 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;