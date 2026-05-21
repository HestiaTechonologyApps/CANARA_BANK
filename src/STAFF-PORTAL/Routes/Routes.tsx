// STAFF-PORTAL/Routes/Routes.tsx

import { Route } from 'react-router-dom';
import StaffLayout from '../Layout/Layout';
import Profile from '../Pages/Profile';
import ShowContribution from '../Pages/ShowContribution';
import AccountSettings from '../Pages/AccountSetting';
import ProtectedRoute from '../../PUBLIC-PORTAL/Auth/ProtectedRoute';
import StaffAccountDirectEntryList from '../Pages/AccountDirectEntry/List';
import StaffAccountDirectEntryCreate from '../Pages/AccountDirectEntry/Create';
import StaffAccountDirectEntryEdit from '../Pages/AccountDirectEntry/Edit';
import StaffEdit from '../Pages/StaffEdit';
import StaffAccountDirectEntryView from '../Pages/AccountDirectEntry/View';
import Claims from '../../PUBLIC-PORTAL/Pages/Claims';

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
    {/* <Route path="nominee" element={<UpdateNominee />} /> */}
    <Route path="staff-edit/:memberId" element={<StaffEdit />} />
    <Route path="contribution-list" element={<StaffAccountDirectEntryList />} />
    <Route path="contributions/staffaccountDirectEntry-create" element={<StaffAccountDirectEntryCreate />} />
    <Route path="contributions/staffaccountDirectEntry-view/:accountsDirectEntryID" element={<StaffAccountDirectEntryView />} />
    <Route path="contributions/staffaccountDirectEntry-edit/:accountsDirectEntryID" element={<StaffAccountDirectEntryEdit />} />
    <Route path="settings" element={<AccountSettings />} />
    <Route path="history" element={<ShowContribution />} />
    <Route path="claims" element={<Claims />} />
  </Route>
);

export const getStaffRoutes = () => staffRoutes;