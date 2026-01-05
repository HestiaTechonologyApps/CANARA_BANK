// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import PageNotFound from '../ADMIN-PORTAL/Pages/Dashboard/PageNotFound';

// Import route collections
import { publicRoutes } from '../PUBLIC-PORTAL/Routes/Route';
import { staffRoutes } from '../STAFF-PORTAL/Routes/Routes';
import { adminRoutes } from '../ADMIN-PORTAL/Routes/Route';
import Unauthorized from '../PUBLIC-PORTAL/Pages/Unauthorized';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      {publicRoutes}

      {/* Admin Dashboard Routes - Admin User & Super Admin only */}
      {adminRoutes}

      {/* Staff Portal Routes - Staff role only */}
      {staffRoutes}

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Catch all unknown routes */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;