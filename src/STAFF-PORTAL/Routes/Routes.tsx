// STAFF-PORTAL/Routes/Routes.tsx
// IMPORTANT: This component should NOT contain <Routes> or <Router>
// It's just a collection of Route definitions to be used in the main AppRoutes

import { Route } from 'react-router-dom';
import StaffLayout from '../Layout/Layout';
import Profile from '../Pages/Profile';
import UpdateNominee from '../Pages/UpdateNominee';
import DirectContribution from '../Pages/DirectContribution';
import ShowContribution from '../Pages/ShowContribution';
import AccountSettings from '../Pages/AccountSetting';
import ProtectedRoute from '../../PUBLIC-PORTAL/Auth/ProtectedRoute';

export const staffRoutes = (
  <Route
    path="/staff-portal"
    element={
      <ProtectedRoute allowedRoles={['Staff']}>
        <StaffLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Profile />} />
    <Route path="nominee" element={<UpdateNominee />} />
    <Route path="contribution" element={<DirectContribution />} />
    <Route path="settings" element={<AccountSettings />} />
    <Route path="history" element={<ShowContribution />} />
  </Route>
);

// Alternative: Export as function
export const getStaffRoutes = () => staffRoutes;