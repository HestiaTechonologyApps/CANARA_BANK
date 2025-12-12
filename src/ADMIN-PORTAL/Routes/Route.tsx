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

        {/* Customer */}
        <Route path='settings/customer-list' element={<CustomerList/>} />
        <Route path='settings/customer-create' element={<CustomerCreate />} />
        <Route path='settings/customer-edit/:customerId' element={<CustomerEdit />} />

        {/* Manage Committe */}
        {/* ///demo */}
        <Route path='cms/manage-committe-list' element={<ManagingCommitteeList/>} />
        <Route path='cms/manage-committe-create' element={<ManagingCommitteeCreate />} />
        <Route path='cms/manage-committe-edit/:managingComitteeId' element={<ManagingCommitteeEdit />} />
        <Route path='cms/manage-committe-view/:managingComitteeId' element={<ManagingCommitteeView />} />

        {/* Main Page */}
        <Route path='cms/mainpage-list' element={<MainPageList/>} />
        <Route path='cms/mainpage-create' element={<MainPageCreate />} />
        <Route path='cms/mainpage-edit/:mainPageId' element={<MainPageEdit />} />
        {/* <Route path='cms/mainpage-view/:mainPageId' element={<MainPageView />} /> */}

      </Route>
      
      {/* Catch-All Route for 404 */}
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}