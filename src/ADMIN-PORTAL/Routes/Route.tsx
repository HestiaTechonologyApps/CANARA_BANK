// Routes/AdminRoutes.tsx
import { Route } from 'react-router-dom';
import DashBoard from '../Pages/Dashboard/DashBoard';
import HomePage from '../Layout/HomePage';
import PageNotFound from '../Pages/Dashboard/PageNotFound';
import Login from '../../PUBLIC-PORTAL/Auth/Login';

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

//Account Direcy Entry
import AccountDirectEntryList from '../Pages/Contributions/AccountDirectEntry/List';
import AccountDirectEntryCreate from '../Pages/Contributions/AccountDirectEntry/Create';
import AccountDirectEntryEdit from '../Pages/Contributions/AccountDirectEntry/Edit';
import AccountDirectEntryView from '../Pages/Contributions/AccountDirectEntry/View';

//Public Page
import PublicPageList from '../Pages/PublicPage/List';
import PublicPageCreate from '../Pages/PublicPage/Create';
import PublicPageView from '../Pages/PublicPage/View';

// Export route configuration as JSX elements
export const adminRoutes = (
  <Route path="/admin" element={<HomePage />}>
    <Route index element={<DashBoard />} />
    <Route path="login" element={<Login />} />
    
    {/* User */}
    <Route path="user/list" element={<UserList />} />
    <Route path="user/create" element={<UserCreate />} />
    <Route path="user/edit/:id" element={<UserEdit />} />
    <Route path="user/view/:id" element={<UserView />} />
    
    {/* Customer */}
    <Route path="customer/list" element={<CustomerList />} />
    <Route path="customer/create" element={<CustomerCreate />} />
    <Route path="customer/edit/:id" element={<CustomerEdit />} />
    <Route path="customer/view/:id" element={<CustomerView />} />
    
    {/* State */}
    <Route path="state/list" element={<StateList />} />
    <Route path="state/create" element={<StateCreate />} />
    <Route path="state/edit/:id" element={<StateEdit />} />
    <Route path="state/view/:id" element={<StateView />} />
    
    {/* Category */}
    <Route path="category/list" element={<CategoryList />} />
    <Route path="category/create" element={<CategoryCreate />} />
    <Route path="category/edit/:id" element={<CategoryEdit />} />
    <Route path="category/view/:id" element={<CategoryView />} />
    
    {/* Branch */}
    <Route path="branch/list" element={<BranchList />} />
    <Route path="branch/create" element={<BranchCreate />} />
    <Route path="branch/edit/:id" element={<BranchEdit />} />
    <Route path="branch/view/:id" element={<BranchView />} />
    
    {/* Circles */}
    <Route path="circle/list" element={<CircleList />} />
    <Route path="circle/create" element={<CircleCreate />} />
    <Route path="circle/edit/:id" element={<CircleEdit />} />
    <Route path="circle/view/:id" element={<CircleView />} />
    
    {/* Company */}
    <Route path="company/list" element={<CompanyList />} />
    <Route path="company/create" element={<CompanyCreate />} />
    <Route path="company/edit/:id" element={<CompanyEdit />} />
    <Route path="company/view/:id" element={<CompanyView />} />
    
    {/* Designation */}
    <Route path="designation/list" element={<DesignationList />} />
    <Route path="designation/create" element={<DesignationCreate />} />
    <Route path="designation/edit/:id" element={<DesignationEdit />} />
    <Route path="designation/view/:id" element={<DesignationView />} />
    
    {/* Status */}
    <Route path="status/list" element={<StatusList />} />
    <Route path="status/create" element={<StatusCreate />} />
    <Route path="status/edit/:id" element={<StatusEdit />} />
    <Route path="status/view/:id" element={<StatusView />} />
    
    {/* UserType */}
    <Route path="usertype/list" element={<UserTypeList />} />
    <Route path="usertype/create" element={<UserTypeCreate />} />
    <Route path="usertype/edit/:id" element={<UserTypeEdit />} />
    <Route path="usertype/view/:id" element={<UserTypeView />} />
    
    {/* Month */}
    <Route path="month/list" element={<MonthList />} />
    <Route path="month/create" element={<MonthCreate />} />
    <Route path="month/edit/:id" element={<MonthEdit />} />
    <Route path="month/view/:id" element={<MonthView />} />
    
    {/* Manage Committe */}
    <Route path="managingcommittee/list" element={<ManagingCommitteeList />} />
    <Route path="managingcommittee/create" element={<ManagingCommitteeCreate />} />
    <Route path="managingcommittee/edit/:id" element={<ManagingCommitteeEdit />} />
    <Route path="managingcommittee/view/:id" element={<ManagingCommitteeView />} />
    
    {/* Main Page */}
    <Route path="mainpage/list" element={<MainPageList />} />
    <Route path="mainpage/create" element={<MainPageCreate />} />
    <Route path="mainpage/edit/:id" element={<MainPageEdit />} />
    <Route path="mainpage/view/:id" element={<MainPageView />} />
    
    {/* Member */}
    <Route path="member/list" element={<MemberList />} />
    <Route path="member/create" element={<MemberCreate />} />
    <Route path="member/edit/:id" element={<MemberEdit />} />
    <Route path="member/view/:id" element={<MemberView />} />
    
    {/* Refund */}
    <Route path="refund/list" element={<RefundContributionList />} />
    <Route path="refund/create" element={<RefundContributionCreate />} />
    <Route path="refund/edit/:id" element={<RefundContributionEdit />} />
    <Route path="refund/view/:id" element={<RefundContributionView />} />
    
    {/* Death Claims */}
    <Route path="deathclaim/list" element={<DeathClaimList />} />
    <Route path="deathclaim/create" element={<DeathClaimCreate />} />
    <Route path="deathclaim/edit/:id" element={<DeathClaimEdit />} />
    <Route path="deathclaim/view/:id" element={<DeathClaimView />} />
    
    {/* Day Quote */}
    <Route path="dayquote/list" element={<DayQuoteList />} />
    <Route path="dayquote/create" element={<DayQuoteCreate />} />
    <Route path="dayquote/edit/:id" element={<DayQuoteEdit />} />
    <Route path="dayquote/view/:id" element={<DayQuoteView />} />
    
    {/* Daily News */}
    <Route path="dailynews/list" element={<DailyNewsList />} />
    <Route path="dailynews/create" element={<DailyNewsCreate />} />
    <Route path="dailynews/edit/:id" element={<DailyNewsEdit />} />
    <Route path="dailynews/view/:id" element={<DailyNewsView />} />
    
    {/* Documents*/}
    <Route path="document/list" element={<DocumentList />} />
    <Route path="document/create" element={<DocumentCreate />} />
    
    {/* Direct Pay */}
    <Route path="directpayment/list" element={<DirectPaymentList />} />
    <Route path="directpayment/create" element={<DirectPaymentCreate />} />
    <Route path="directpayment/edit/:id" element={<DirectPaymentEdit />} />
    <Route path="directpayment/view/:id" element={<DirectPaymentView />} />
    
    {/* Account Direcy Entry */}
    <Route path="accountdirectentry/list" element={<AccountDirectEntryList />} />
    <Route path="accountdirectentry/create" element={<AccountDirectEntryCreate />} />
    <Route path="accountdirectentry/edit/:id" element={<AccountDirectEntryEdit />} />
    <Route path="accountdirectentry/view/:id" element={<AccountDirectEntryView />} />
    
    {/* Public Page */}
    <Route path="publicpage/list" element={<PublicPageList />} />
    <Route path="publicpage/create" element={<PublicPageCreate />} />
    <Route path="publicpage/view/:id" element={<PublicPageView />} />
    
    {/* Catch-All Route for 404 */}
    <Route path="*" element={<PageNotFound />} />
  </Route>
);

// Keep default export for backward compatibility
export default function AdminRoutes() {
  return adminRoutes;
}