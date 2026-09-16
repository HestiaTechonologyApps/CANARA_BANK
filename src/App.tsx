// App.tsx
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './Routes/AppRoutes';
import ScrollToTop from './PUBLIC-PORTAL/Common/ScrollTop';

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;