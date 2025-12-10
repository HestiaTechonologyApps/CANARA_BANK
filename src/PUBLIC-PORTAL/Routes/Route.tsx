import { Routes, Route } from 'react-router-dom';
import PageNotFound from '../../ADMIN-PORTAL/Pages/Dashboard/PageNotFound';
import PublicLayout from '../Layout/Layout';

export default function PublicRoutes() {
  return (
    <Routes>
      
       <Route path='/' element={<PublicLayout />} />
      {/* Catch-All Route for 404 */}
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}