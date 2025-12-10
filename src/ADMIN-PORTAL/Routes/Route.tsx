import { Routes, Route } from 'react-router-dom';
import DashBoard from '../Pages/Dashboard/DashBoard';
import HomePage from '../Layout/HomePage';
import PageNotFound from '../Pages/Dashboard/PageNotFound';
import Login from '../../Auth/Login';

//User
import UserList from '../Pages/User/List';
import UserCreate from '../Pages/User/Create';


export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/dashboard" element={<DashBoard />}>
      
        
        <Route index element={<HomePage />} />
         <Route path='settings/user-list' element={<UserList />} />
        <Route path='settings/user-create' element={<UserCreate />} />
      </Route>
      
      {/* Catch-All Route for 404 */}
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}



// import { Route, Routes } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css'

// // // Protected Route Component
// // import ProtectedRoute from './Auth/ProtectedRoute';

// // // Preloader
// // import Preloader from './pages/dashboard/PreLoader';

// // Page not found
// import PageNotFound from '../Pages/Dashboard/PageNotFound';

// // // Auth
// // import Login from './Auth/Login';
// // import ForgotPassword from './Auth/ForgotPassword';

// // Dashboard
// import DashBoard from '../Pages/Dashboard/DashBoard';
// import HomePage from '../Layout/HomePage';

// function App() {
//   return (
//     <>
//       <Routes>
//         {/* Public Routes */}
//         {/* <Route path='/' element={<Preloader />} />
//         <Route path="/login" element={<Login />} />
//         <Route path='/forgot-password' element={<ForgotPassword />} /> */}

//         {/* Protected Routes - Dashboard with HomePage */}
//         <Route path="/dashboard" element={
//         //   <ProtectedRoute>
//             <DashBoard />
//         //   </ProtectedRoute>
//         }>
//           {/* HomePage as index route */}
//           <Route index element={<HomePage />} />
//         </Route>

//         {/* Catch-All Route for 404 */}
//         <Route path='*' element={<PageNotFound />} />
//       </Routes>
//     </>
//   )
// }

// export default App