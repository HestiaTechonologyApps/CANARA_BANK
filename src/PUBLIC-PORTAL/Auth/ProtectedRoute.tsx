// Components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../../Services/Auth.services';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Staff' | 'Admin User' | 'Super Admin')[];
  requireAuth?: boolean;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const location = useLocation();

  
  const isAuthenticated = AuthService.isAuthenticated();

  if (requireAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to home');
   
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
  }

  
  if (!requireAuth) {
    return <>{children}</>;
  }

  
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  
  const userRole = AuthService.getUserRole();
  
 
  if (!userRole) {
    console.log('No user role found, redirecting to home');
    AuthService.logout(); 
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
  }

  
  const normalizedUserRole = userRole.trim().toLowerCase();

 
  const hasAccess = allowedRoles.some(role => {
    const normalizedAllowedRole = role.trim().toLowerCase();
    return normalizedUserRole === normalizedAllowedRole ||
           // Handle variations
           (normalizedAllowedRole === 'admin user' && normalizedUserRole === 'adminuser') ||
           (normalizedAllowedRole === 'super admin' && normalizedUserRole === 'superadmin');
  });

  if (!hasAccess) {
    console.log(`User role ${userRole} not authorized for this route`);
    
    const dashboardRoute = AuthService.getDashboardRoute();
    
    if (dashboardRoute === '/login') {
      console.log('Invalid user role, logging out');
      AuthService.logout();
      return <Navigate to="/login" replace />;
    }
    
    console.log(`Redirecting to appropriate dashboard: ${dashboardRoute}`);
    return <Navigate 
      to={dashboardRoute} 
      state={{ 
        message: 'You do not have permission to access that page',
        from: location 
      }} 
      replace 
    />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;