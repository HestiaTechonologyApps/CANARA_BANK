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

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/dashboard" element={<DashBoard />}>
        <Route index element={<HomePage />} />

        {/* User Routes - Fixed with :userId parameter */}
        <Route path='settings/user-list' element={<UserList />} />
        <Route path='settings/user-create' element={<UserCreate />} />
        <Route path='settings/user-edit/:userId' element={<UserEdit />} />
      </Route>
      
      {/* Catch-All Route for 404 */}
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}