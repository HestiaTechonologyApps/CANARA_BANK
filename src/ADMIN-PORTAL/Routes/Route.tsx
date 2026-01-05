// ADMIN-PORTAL/Routes/Route.tsx
// IMPORTANT: No <Routes> wrapper - just export Route definitions

import { Route } from 'react-router-dom';
import DashBoard from '../Pages/Dashboard/DashBoard';
import HomePage from '../Layout/HomePage';
import ProtectedRoute from '../../PUBLIC-PORTAL/Auth/ProtectedRoute';

//User
import UserList from '../Pages/User/List';
import UserCreate from '../Pages/User/Create';
import UserEdit from '../Pages/User/Edit';
import UserView from '../Pages/User/View';

//Customer
import CustomerList from '../Pages/Customer/List';
import CustomerCreate from '../Pages/Customer/Create';
import CustomerEdit from '../Pages/Customer/Edit';
import CustomerView from '../Pages/Customer/View';

//Manage Committe
import ManagingCommitteeList from '../Pages/ManagingCommittee/List';
import ManagingCommitteeCreate from '../Pages/ManagingCommittee/Create';
import ManagingCommitteeEdit from '../Pages/ManagingCommittee/Edit';
import ManagingCommitteeView from '../Pages/ManagingCommittee/View';

//MainPage
import MainPageList from '../Pages/MainPage/List';
import MainPageCreate from '../Pages/MainPage/Create';
import MainPageEdit from '../Pages/MainPage/Edit';
import MainPageView from '../Pages/MainPage/View';

//State
import StateList from '../Pages/Settings/State/List';
import StateCreate from '../Pages/Settings/State/Create';
import StateEdit from '../Pages/Settings/State/Edit';
import StateView from '../Pages/Settings/State/View';

//Branch
import BranchList from '../Pages/Branch/List';
import BranchCreate from '../Pages/Branch/Create';
import BranchEdit from '../Pages/Branch/Edit';
import BranchView from '../Pages/Branch/View';

//Circle
import CircleList from '../Pages/Circle/List';
import CircleCreate from '../Pages/Circle/Create';
import CircleEdit from '../Pages/Circle/Edit';
import CircleView from '../Pages/Circle/View';

//Company
import CompanyList from '../Pages/Settings/Company/List';
import CompanyCreate from '../Pages/Settings/Company/Create';
import CompanyEdit from '../Pages/Settings/Company/Edit';
import CompanyView from '../Pages/Settings/Company/View';

//Designation
import DesignationList from '../Pages/Settings/Designation/List';
import DesignationCreate from '../Pages/Settings/Designation/Create';
import DesignationEdit from '../Pages/Settings/Designation/Edit';
import DesignationView from '../Pages/Settings/Designation/View';

//Status
import StatusCreate from '../Pages/Settings/Status/Create';
import StatusEdit from '../Pages/Settings/Status/Edit';
import StatusView from '../Pages/Settings/Status/View';
import StatusList from '../Pages/Settings/Status/List';

//UserType
import UserTypeList from '../Pages/UserType/List';
import UserTypeCreate from '../Pages/UserType/Create';
import UserTypeEdit from '../Pages/UserType/Edit';
import UserTypeView from '../Pages/UserType/View';

//Category
import CategoryEdit from '../Pages/Settings/Category/Edit';
import CategoryView from '../Pages/Settings/Category/View';
import CategoryCreate from '../Pages/Settings/Category/Create';
import CategoryList from '../Pages/Settings/Category/List';

//Month
import MonthList from '../Pages/Settings/Month/List';
import MonthCreate from '../Pages/Settings/Month/Create';
import MonthEdit from '../Pages/Settings/Month/Edit';
import MonthView from '../Pages/Settings/Month/View';

//Member
import MemberList from '../Pages/Contributions/Member/List';
import MemberCreate from '../Pages/Contributions/Member/Create';
import MemberEdit from '../Pages/Contributions/Member/Edit';
import MemberView from '../Pages/Contributions/Member/View';

//Refund Contribution
import RefundContributionList from '../Pages/Claims/Refund/List';
import RefundContributionCreate from '../Pages/Claims/Refund/Create';
import RefundContributionEdit from '../Pages/Claims/Refund/Edit';
import RefundContributionView from '../Pages/Claims/Refund/View';

//Death Claims
import DeathClaimList from '../Pages/Claims/DeathClaims/List';
import DeathClaimCreate from '../Pages/Claims/DeathClaims/Create';
import DeathClaimEdit from '../Pages/Claims/DeathClaims/Edit';
import DeathClaimView from '../Pages/Claims/DeathClaims/View';

//Day Quote
import DayQuoteList from '../Pages/DayQuote/List';
import DayQuoteCreate from '../Pages/DayQuote/Create';
import DayQuoteEdit from '../Pages/DayQuote/Edit';
import DayQuoteView from '../Pages/DayQuote/View';

//Daily News
import DailyNewsList from '../Pages/DailyNews/List';
import DailyNewsCreate from '../Pages/DailyNews/Create';
import DailyNewsEdit from '../Pages/DailyNews/Edit';
import DailyNewsView from '../Pages/DailyNews/View';

//Document
import DocumentList from '../Pages/Documents/List';
import DocumentCreate from '../Pages/Documents/Create';

//Direct Pay
import DirectPaymentList from '../Pages/Contributions/DirectPay/List';
import DirectPaymentCreate from '../Pages/Contributions/DirectPay/Create';
import DirectPaymentEdit from '../Pages/Contributions/DirectPay/Edit';
import DirectPaymentView from '../Pages/Contributions/DirectPay/View';

//Account Direct Entry
import AccountDirectEntryList from '../Pages/Contributions/AccountDirectEntry/List';
import AccountDirectEntryCreate from '../Pages/Contributions/AccountDirectEntry/Create';
import AccountDirectEntryEdit from '../Pages/Contributions/AccountDirectEntry/Edit';
import AccountDirectEntryView from '../Pages/Contributions/AccountDirectEntry/View';
import PublicPageList from '../Pages/PublicPage/List';
import PublicPageCreate from '../Pages/PublicPage/Create';
import PublicPageView from '../Pages/PublicPage/View';

export const adminRoutes = (
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute allowedRoles={['Admin User', 'Super Admin']}>
        <DashBoard />
      </ProtectedRoute>
    }
  >
    <Route index element={<HomePage />} />
    
    {/* User */}
    <Route path="settings/user-list" element={<UserList />} />
    <Route path="settings/user-create" element={<UserCreate />} />
    <Route path="settings/user-edit/:userId" element={<UserEdit />} />
    <Route path="settings/user-view/:userId" element={<UserView />} />

    {/* Customer */}
    <Route path="customer-list" element={<CustomerList />} />
    <Route path="customer-create" element={<CustomerCreate />} />
    <Route path="customer-edit/:customerId" element={<CustomerEdit />} />
    <Route path="customer-view/:customerId" element={<CustomerView />} />

    {/* State */}
    <Route path="settings/state-list" element={<StateList />} />
    <Route path="settings/state-create" element={<StateCreate />} />
    <Route path="settings/state-edit/:stateId" element={<StateEdit />} />
    <Route path="settings/state-view/:stateId" element={<StateView />} />

    {/* Category */}
    <Route path="settings/category-list" element={<CategoryList />} />
    <Route path="settings/category-create" element={<CategoryCreate />} />
    <Route path="settings/category-edit/:categoryId" element={<CategoryEdit />} />
    <Route path="settings/category-view/:categoryId" element={<CategoryView />} />

    {/* Branch */}
    <Route path="settings/branch-list" element={<BranchList />} />
    <Route path="settings/branch-create" element={<BranchCreate />} />
    <Route path="settings/branch-edit/:branchId" element={<BranchEdit />} />
    <Route path="settings/branch-view/:branchId" element={<BranchView />} />

    {/* Circles */}
    <Route path="settings/circle-list" element={<CircleList />} />
    <Route path="settings/circle-create" element={<CircleCreate />} />
    <Route path="settings/circle-edit/:circleId" element={<CircleEdit />} />
    <Route path="settings/circle-view/:circleId" element={<CircleView />} />

    {/* Company */}
    <Route path="settings/company-list" element={<CompanyList />} />
    <Route path="settings/company-create" element={<CompanyCreate />} />
    <Route path="settings/company-edit/:companyId" element={<CompanyEdit />} />
    <Route path="settings/company-view/:companyId" element={<CompanyView />} />

    {/* Designation */}
    <Route path="settings/designation-list" element={<DesignationList />} />
    <Route path="settings/designation-create" element={<DesignationCreate />} />
    <Route path="settings/designation-edit/:designationId" element={<DesignationEdit />} />
    <Route path="settings/designation-view/:designationId" element={<DesignationView />} />

    {/* Status */}
    <Route path="settings/status-list" element={<StatusList />} />
    <Route path="settings/status-create" element={<StatusCreate />} />
    <Route path="settings/status-edit/:statusId" element={<StatusEdit />} />
    <Route path="settings/status-view/:statusId" element={<StatusView />} />

    {/* UserType */}
    <Route path="settings/usertype-list" element={<UserTypeList />} />
    <Route path="settings/usertype-create" element={<UserTypeCreate />} />
    <Route path="settings/usertype-edit/:userTypeId" element={<UserTypeEdit />} />
    <Route path="settings/usertype-view/:userTypeId" element={<UserTypeView />} />

    {/* Month */}
    <Route path="settings/month-list" element={<MonthList />} />
    <Route path="settings/month-create" element={<MonthCreate />} />
    <Route path="settings/month-edit/:monthId" element={<MonthEdit />} />
    <Route path="settings/month-view/:monthId" element={<MonthView />} />

    {/* Manage Committe */}
    <Route path="cms/manage-committe-list" element={<ManagingCommitteeList />} />
    <Route path="cms/manage-committe-create" element={<ManagingCommitteeCreate />} />
    <Route path="cms/manage-committe-edit/:managingComiteeId" element={<ManagingCommitteeEdit />} />
    <Route path="cms/manage-committe-view/:managingComiteeId" element={<ManagingCommitteeView />} />

    {/* Main Page */}
    <Route path="cms/mainpage-list" element={<MainPageList />} />
    <Route path="cms/mainpage-create" element={<MainPageCreate />} />
    <Route path="cms/mainpage-edit/:mainPageId" element={<MainPageEdit />} />
    <Route path="cms/mainpage-view/:mainPageId" element={<MainPageView />} />

    {/* Member */}
    <Route path="contributions/member-list" element={<MemberList />} />
    <Route path="contributions/member-create" element={<MemberCreate />} />
    <Route path="contributions/member-edit/:memberId" element={<MemberEdit />} />
    <Route path="contributions/member-view/:memberId" element={<MemberView />} />

    {/* Refund */}
    <Route path="claims/refundcontribution-list" element={<RefundContributionList/>}/>
    <Route path="claims/refundcontribution-create" element={<RefundContributionCreate/>}/>
    <Route path="claims/refundcontribution-edit/:refundContributionId" element={<RefundContributionEdit/>}/>
    <Route path="claims/refundcontribution-view/:refundContributionId" element={<RefundContributionView/>}/>

    {/* Death Claims */}
    <Route path="claims/deathclaims-list" element={<DeathClaimList/>}/>
    <Route path="claims/deathclaims-create" element={<DeathClaimCreate/>}/>
    <Route path="claims/deathclaims-edit/:deathClaimId" element={<DeathClaimEdit/>}/>
    <Route path="claims/deathclaims-view/:deathClaimId" element={<DeathClaimView/>}/>

    {/* Day Quote */}
    <Route path="cms/dayquote-list" element={<DayQuoteList/>}/>
    <Route path="cms/dayquote-create" element={<DayQuoteCreate/>}/>
    <Route path="cms/dayquote-edit/:dayQuoteId" element={<DayQuoteEdit/>}/>
    <Route path="cms/dayquote-view/:dayQuoteId" element={<DayQuoteView/>}/>

    {/* Daily News */}
    <Route path="cms/dailynews-list" element={<DailyNewsList/>}/>
    <Route path="cms/dailynews-create" element={<DailyNewsCreate/>}/>
    <Route path="cms/dailynews-edit/:dailyNewsId" element={<DailyNewsEdit/>}/>
    <Route path="cms/dailynews-view/:dailyNewsId" element={<DailyNewsView/>}/>

    {/* Direct Pay */}
    <Route path="contributions/directpayment-list" element={<DirectPaymentList/>}/>
    <Route path="contributions/directpayment-create" element={<DirectPaymentCreate/>}/>
    <Route path="contributions/directpayment-edit/:directPaymentId" element={<DirectPaymentEdit/>}/>
    <Route path="contributions/directpayment-view/:directPaymentId" element={<DirectPaymentView/>}/>

    {/* Account Direct Entry */}
    <Route path='contributions/accountDirectEntry-list' element={<AccountDirectEntryList/>}/>
    <Route path='contributions/accountDirectEntry-create' element={<AccountDirectEntryCreate/>}/>
    <Route path='contributions/accountDirectEntry-edit/:accountsDirectEntryID' element={<AccountDirectEntryEdit/>}/>
    <Route path='contributions/accountDirectEntry-view/:accountsDirectEntryID' element={<AccountDirectEntryView/>}/>

    {/* Documents */}
    <Route path='cms/documents-list' element={<DocumentList/>}/>
    <Route path='cms/documents-create' element={<DocumentCreate/>}/>

    {/* Public Page */}
    <Route path='cms/publicPage-list' element={<PublicPageList/>}/>
    <Route path='cms/publicPage-create' element={<PublicPageCreate/>}/>
    <Route path='cms/publicPage-view/:publicPageId' element={<PublicPageView/>}/>
  </Route>
);

export default adminRoutes;