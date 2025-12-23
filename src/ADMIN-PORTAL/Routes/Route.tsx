// Routes/AdminRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import DashBoard from '../Pages/Dashboard/DashBoard';
import HomePage from '../Layout/HomePage';
import PageNotFound from '../Pages/Dashboard/PageNotFound';
import Login from '../../Auth/Login';

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

// //State
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

//Direct Pay
import DirectPaymentList from '../Pages/Contributions/DirectPay/List';
import DirectPaymentCreate from '../Pages/Contributions/DirectPay/Create';
import DirectPaymentEdit from '../Pages/Contributions/DirectPay/Edit';
import DirectPaymentView from '../Pages/Contributions/DirectPay/View';





export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<DashBoard />}>
        <Route index element={<HomePage />} />

        {/* User */}
        <Route path='/dashboard/settings/user-list' element={<UserList />} />
        <Route path='/dashboard/settings/user-create' element={<UserCreate />} />
        <Route path='/dashboard/settings/user-edit/:userId' element={<UserEdit />} />
        <Route path='/dashboard/settings/user-view/:userId' element={<UserView />} />

        {/* Customer */}
        <Route path='/dashboard/customer-list' element={<CustomerList />} />
        <Route path='/dashboard/customer-create' element={<CustomerCreate />} />
        <Route path='/dashboard/customer-edit/:customerId' element={<CustomerEdit />} />
        <Route path='/dashboard/customer-view/:customerId' element={<CustomerView />} />

        {/* State */}
        <Route path="/dashboard/settings/state-list" element={<StateList />} />
        <Route path="/dashboard/settings/state-create" element={<StateCreate />} />
        <Route path="/dashboard/settings/state-edit/:stateId" element={<StateEdit />} />
        <Route path="/dashboard/settings/state-view/:stateId" element={<StateView />} />

        {/* Category */}
        <Route path="/dashboard/settings/category-list" element={<CategoryList />} />
        <Route path="/dashboard/settings/category-create" element={<CategoryCreate />} />
        <Route path="/dashboard/settings/category-edit/:categoryId" element={<CategoryEdit />} />
        <Route path="/dashboard/settings/category-view/:categoryId" element={<CategoryView />} />

        {/* Branch */}
        <Route path="/dashboard/settings/branch-list" element={<BranchList />} />
        <Route path="/dashboard/settings/branch-create" element={<BranchCreate />} />
        <Route path="/dashboard/settings/branch-edit/:branchId" element={<BranchEdit />} />
        <Route path="/dashboard/settings/branch-view/:branchId" element={<BranchView />} />

        {/* Circles */}
        <Route path="/dashboard/settings/circle-list" element={<CircleList />} />
        <Route path="/dashboard/settings/circle-create" element={<CircleCreate />} />
        <Route path="/dashboard/settings/circle-edit/:circleId" element={<CircleEdit />} />
        <Route path="/dashboard/settings/circle-view/:circleId" element={<CircleView />} />

        {/* Company */}
        <Route path="/dashboard/settings/company-list" element={<CompanyList />} />
        <Route path="/dashboard/settings/company-create" element={<CompanyCreate />} />
        <Route path="/dashboard/settings/company-edit/:companyId" element={<CompanyEdit />} />
        <Route path="/dashboard/settings/company-view/:companyId" element={<CompanyView />} />

        {/* Designation */}
        <Route path="/dashboard/settings/designation-list" element={<DesignationList />} />
        <Route path="/dashboard/settings/designation-create" element={<DesignationCreate />} />
        <Route path="/dashboard/settings/designation-edit/:designationId" element={<DesignationEdit />} />
        <Route path="/dashboard/settings/designation-view/:designationId" element={<DesignationView />} />

        {/* Status */}
        <Route path="/dashboard/settings/status-list" element={<StatusList />} />
        <Route path="/dashboard/settings/status-create" element={<StatusCreate />} />
        <Route path="/dashboard/settings/status-edit/:statusId" element={<StatusEdit />} />
        <Route path="/dashboard/settings/status-view/:statusId" element={<StatusView />} />

        {/* UserType */}
        <Route path="/dashboard/settings/usertype-list" element={<UserTypeList />} />
        <Route path="/dashboard/settings/usertype-create" element={<UserTypeCreate />} />
        <Route path="/dashboard/settings/usertype-edit/:userTypeId" element={<UserTypeEdit />} />
        <Route path="/dashboard/settings/usertype-view/:userTypeId" element={<UserTypeView />} />

        {/* Month */}
        <Route path="/dashboard/settings/month-list" element={<MonthList />} />
        <Route path="/dashboard/settings/month-create" element={<MonthCreate />} />
        <Route path="/dashboard/settings/month-edit/:monthId" element={<MonthEdit />} />
        <Route path="/dashboard/settings/month-view/:monthId" element={<MonthView />} />

        {/* Manage Committe */}
        <Route path='/dashboard/cms/manage-committe-list' element={<ManagingCommitteeList />} />
        <Route path='/dashboard/cms/manage-committe-create' element={<ManagingCommitteeCreate />} />
        <Route path='/dashboard/cms/manage-committe-edit/:managingComitteeId' element={<ManagingCommitteeEdit />} />
        <Route path='/dashboard/cms/manage-committe-view/:managingComitteeId' element={<ManagingCommitteeView />} />

        {/* Main Page */}
        <Route path='/dashboard/cms/mainpage-list' element={<MainPageList />} />
        <Route path='/dashboard/cms/mainpage-create' element={<MainPageCreate />} />
        <Route path='/dashboard/cms/mainpage-edit/:mainPageId' element={<MainPageEdit />} />
        <Route path='/dashboard/cms/mainpage-view/:mainPageId' element={<MainPageView />} />

        {/* Member */}
        <Route path='/dashboard/contributions/member-list' element={<MemberList />} />
        <Route path='/dashboard/contributions/member-create' element={<MemberCreate />} />
        <Route path='/dashboard/contributions/member-edit/:memberId' element={<MemberEdit />} />
        <Route path='/dashboard/contributions/member-view/:memberId' element={<MemberView />} />

         {/* Refund */}
         <Route path='/dashboard/claims/refundcontribution-list' element={<RefundContributionList/>}/>
         <Route path='/dashboard/claims/refundcontribution-create' element={<RefundContributionCreate/>}/>
         <Route path='/dashboard/claims/refundcontribution-edit/:refundContributionId' element={<RefundContributionEdit/>}/>
         <Route path='/dashboard/claims/refundcontribution-view/:refundContributionId' element={<RefundContributionView/>}/>

        {/* Death Claims */}
         <Route path='/dashboard/claims/deathclaims-list' element={<DeathClaimList/>}/>
         <Route path='/dashboard/claims/deathclaims-create' element={<DeathClaimCreate/>}/>
         <Route path='/dashboard/claims/deathclaims-edit/:deathClaimId' element={<DeathClaimEdit/>}/>
         <Route path='/dashboard/claims/deathclaims-view/:deathClaimId' element={<DeathClaimView/>}/>

         {/* Day Quote */}
         <Route path='/dashboard/cms/dayquote-list' element={<DayQuoteList/>}/>
         <Route path='/dashboard/cms/dayquote-create' element={<DayQuoteCreate/>}/>
         <Route path='/dashboard/cms/dayquote-edit/:dayQuoteId' element={<DayQuoteEdit/>}/>
         <Route path='/dashboard/cms/dayquote-view/:dayQuoteId' element={<DayQuoteView/>}/>

         {/* Daily News */}
          <Route path='/dashboard/cms/dailynews-list' element={<DailyNewsList/>}/>
          <Route path='/dashboard/cms/dailynews-create' element={<DailyNewsCreate/>}/>
          <Route path='/dashboard/cms/dailynews-edit/:dailyNewsId' element={<DailyNewsEdit/>}/>
          <Route path='/dashboard/cms/dailynews-view/:dailyNewsId' element={<DailyNewsView/>}/>

          {/* Direct Pay */}
          <Route path='/dashboard/contributions/directpayment-list' element={<DirectPaymentList/>}/>
          <Route path='/dashboard/contributions/directpayment-create' element={<DirectPaymentCreate/>}/>
          <Route path='/dashboard/contributions/directpayment-edit/:directPaymentId' element={<DirectPaymentEdit/>}/>
          <Route path='/dashboard/contributions/directpayment-view/:directPaymentId' element={<DirectPaymentView/>}/>
      </Route>

      {/* Catch-All Route for 404 */}
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}