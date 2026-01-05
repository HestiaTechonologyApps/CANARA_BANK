// Components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../../Services/Auth.services';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Staff' | 'Admin User' | 'Super Admin')[];
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component for role-based access control
 * 
 * Usage examples:
 * 
 * 1. Require authentication only:
 *    <ProtectedRoute>
 *      <YourComponent />
 *    </ProtectedRoute>
 * 
 * 2. Admin and Super Admin only:
 *    <ProtectedRoute allowedRoles={['Admin User', 'Super Admin']}>
 *      <AdminDashboard />
 *    </ProtectedRoute>
 * 
 * 3. Staff only:
 *    <ProtectedRoute allowedRoles={['Staff']}>
 *      <StaffPortal />
 *    </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = AuthService.isAuthenticated();

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    // Redirect to login page in public portal, saving the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific roles are required, just check authentication
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Get user's role
  const userRole = AuthService.getUserRole();
  
  if (!userRole) {
    console.log('No user role found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize user role for comparison
  const normalizedUserRole = userRole.trim().toLowerCase();

  // Check if user's role is in the allowed roles
  const hasAccess = allowedRoles.some(role => {
    const normalizedAllowedRole = role.trim().toLowerCase();
    return normalizedUserRole === normalizedAllowedRole ||
           // Handle variations
           (normalizedAllowedRole === 'admin user' && normalizedUserRole === 'adminuser') ||
           (normalizedAllowedRole === 'super admin' && normalizedUserRole === 'superadmin');
  });

  if (!hasAccess) {
    console.log(`User role ${userRole} not authorized for this route`);
    
    // If user is trying to access wrong portal, redirect to their appropriate dashboard
    const dashboardRoute = AuthService.getDashboardRoute();
    
    // Only redirect if they're not already on their correct route
    if (location.pathname !== dashboardRoute && !location.pathname.startsWith(dashboardRoute)) {
      console.log(`Redirecting to appropriate dashboard: ${dashboardRoute}`);
      return <Navigate to={dashboardRoute} replace />;
    }
    
    // If already on correct portal but wrong page, show unauthorized message
    return <Navigate to="/unauthorized" replace />;
  }

  // User has access, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;