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
import RefundContributionByMemberList from '../Pages/Refund/List';
import MemberRefundContributionCreate from '../Pages/Refund/Create';
import MemberRefundContributionEdit from '../Pages/Refund/Edit';
import MemberRefundContributionView from '../Pages/Refund/View';

export const staffRoutes = (
 <Route
  path="/staff-portal"
  element={
    <ProtectedRoute allowedRoles={['OfficeStaff', 'DEO']}>
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
    <Route path="refund-list" element={<RefundContributionByMemberList />} />
    <Route path="refund-list/MemberRefundContribution-create" element={<MemberRefundContributionCreate/>}/>
    <Route path="refund-list/MemberRefundContribution-edit/:refundContributionId" element={<MemberRefundContributionEdit/>}/>
    <Route path="refund-list/MemberRefundContribution-view/:refundContributionId" element={<MemberRefundContributionView/>}/>
  </Route>
);
    {/* <Route path="refund-list" element={<RefundContributionByMemberList />} />
    <Route path="refund-list/MemberRefundContribution-create" element={<MemberRefundContributionCreate/>}/>
    <Route path="refund-list/MemberRefundContribution-edit" element={<MemberRefundContributionEdit/>}/>
    <Route path="refund-list/MemberRefundContribution-view" element={<MemberRefundContributionView/>}/>
  </Route>
); */}

export const getStaffRoutes = () => staffRoutes;