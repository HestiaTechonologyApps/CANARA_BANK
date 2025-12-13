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

//Manage Committe
import ManagingCommitteeList from '../Pages/ManagingCommittee/List';
import ManagingCommitteeCreate from '../Pages/ManagingCommittee/List';
import ManagingCommitteeEdit from '../Pages/ManagingCommittee/List';
import ManagingCommitteeView from '../Pages/ManagingCommittee/List';

//MainPage
import MainPageList from '../Pages/MainPage/List';
import MainPageCreate from '../Pages/MainPage/Create';
import MainPageEdit from '../Pages/MainPage/Edit';
// import MainPageView from '../Pages/MainPage/View';

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

//Status
import StatusList from '../Pages/Settings/Status/List';
import StatusCreate from '../Pages/Settings/Status/Create';
import StatusEdit from '../Pages/Settings/Status/Edit';
import StatusView from '../Pages/Settings/Status/View';

//Category
import CategoryList from '../Pages/Settings/Category/List';
import CategoryCreate from '../Pages/Settings/Category/Create';
import CategoryEdit from '../Pages/Settings/Category/Edit';
import CategoryView from '../Pages/Settings/Category/View';

//Designation
import DesignationList from '../Pages/Settings/Designation/List';
import DesignationCreate from '../Pages/Settings/Designation/Create';
import DesignationEdit from '../Pages/Settings/Designation/Edit';
import DesignationView from '../Pages/Settings/Designation/View';



export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<DashBoard />}>
        <Route index element={<HomePage />} />

        {/* User */}
        <Route path='settings/user-list' element={<UserList />} />
        <Route path='settings/user-create' element={<UserCreate />} />
        <Route path='settings/user-edit/:userId' element={<UserEdit />} />
        <Route path='settings/user-view/:userId' element={<UserView />} />

        {/* Customer */}
        <Route path='settings/customer-list' element={<CustomerList />} />
        <Route path='settings/customer-create' element={<CustomerCreate />} />
        <Route path='settings/customer-edit/:customerId' element={<CustomerEdit />} />

        {/* State */}
        <Route path="/dashboard/settings/state-list" element={<StateList />} />
        <Route path="/dashboard/settings/state-create" element={<StateCreate />} />
        <Route path="/dashboard/settings/state-edit/:stateId" element={<StateEdit />} />
        <Route path="/dashboard/settings/state-view/:stateId" element={<StateView />} />

        {/* Branch */}
        <Route path="/dashboard/settings/branch-list" element={<BranchList />} />
        <Route path="/dashboard/settings/branch-create" element={<BranchCreate />} />
        <Route path="/dashboard/settings/branch-edit/:branchId" element={<BranchEdit />} />
        <Route path="/dashboard/settings/branch-view/:stateId" element={<BranchView />} />

        {/* Status */}
        <Route path="/dashboard/settings/status-list" element={<StatusList />} />
        <Route path="/dashboard/settings/status-create" element={<StatusCreate />} />
        <Route path="/dashboard/settings/status-edit/:statusId" element={<StatusEdit />} />
        <Route path="/dashboard/settings/status-view/:statusId" element={<StatusView />} />

        {/* Category */}
        <Route path="/dashboard/settings/category-list" element={<CategoryList />} />
        <Route path="/dashboard/settings/category-create" element={<CategoryCreate />} />
        <Route path="/dashboard/settings/category-edit/:categoryId" element={<CategoryEdit />} />
        <Route path="/dashboard/settings/category-view/:categoryId" element={<CategoryView />} />

        {/* Circles */}
        <Route path="/dashboard/settings/circles-list" element={<CircleList />} />
        <Route path="/dashboard/settings/circles-create" element={<CircleCreate />} />
        <Route path="/dashboard/settings/circles-edit/:circleId" element={<CircleEdit />} />
        {/* <Route path="/dashboard/settings/circles-view/:stateId" element={<StateView />} /> */}

        {/* Designation */}
        <Route path="/dashboard/settings/designation-list" element={<DesignationList />} />
        <Route path="/dashboard/settings/designation-create" element={<DesignationCreate />} />
        <Route path="/dashboard/settings/designation-edit/:designationId" element={<DesignationEdit />} />
        <Route path="/dashboard/settings/designation-view/:designationId" element={<DesignationView />} />

        {/* Manage Committe */}
        {/* ///demo */}
        <Route path='cms/manage-committe-list' element={<ManagingCommitteeList />} />
        <Route path='cms/manage-committe-create' element={<ManagingCommitteeCreate />} />
        <Route path='cms/manage-committe-edit/:managingComitteeId' element={<ManagingCommitteeEdit />} />
        <Route path='cms/manage-committe-view/:managingComitteeId' element={<ManagingCommitteeView />} />

        {/* Main Page */}
        <Route path='cms/mainpage-list' element={<MainPageList />} />
        <Route path='cms/mainpage-create' element={<MainPageCreate />} />
        <Route path='cms/mainpage-edit/:mainPageId' element={<MainPageEdit />} />
        {/* <Route path='cms/mainpage-view/:mainPageId' element={<MainPageView />} /> */}



      </Route>

      {/* Catch-All Route for 404 */}
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}