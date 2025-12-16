import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import AdminRoutes from "./ADMIN-PORTAL/Routes/Route";
import PublicRoutes from "./PUBLIC-PORTAL/Routes/Route";
import StaffRoutes from "./STAFF-PORTAL/Routes/Routes";
// import StaffRoutes from "./STAFF-PORTAL/Routes/Route";

// For Vite projects, use import.meta.env with VITE_ prefix
const portal = import.meta.env.VITE_PORTAL;

function App() {
  if (portal === "admin") return <AdminRoutes />;
  if (portal === "public") return <PublicRoutes />;
  if (portal === "staff") return <StaffRoutes />;
  
  
  // Error message if no portal is specified
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'Urbanist'
    }}>
      <h2 style={{ color: '#882626ff' }}>⚠️ No Portal Specified</h2>
      <p>Please run one of the following commands:</p>
      <ul style={{ textAlign: 'left' }}>
        <li><code>npm run start-admin</code></li>
        <li><code>npm run start-public</code></li>
        <li><code>npm run start-staff</code></li>
      </ul>
    </div>
  );
}

export default App;