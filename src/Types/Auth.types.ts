// src/types/Auth.types.ts
import type { AuditTrails } from "./AuditLog.types";

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  staffNo: number;
  memberId?: number; // Added to match backend response
  phoneNumber: string;
  address: string;
  passwordHash: string;
  oldPassword?: string;
  newPassword?: string;
  isActive: boolean;
  islocked: boolean;
  createAt: string;
  lastlogin: string;
  lastloginString: string;
  createAtSyring: string;
  companyId?: number;
  companyName?: string;
  role: string; // User role from backend
  auditLogs?: AuditTrails[];
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

// Type guard to check if user has valid role
export function isValidUserRole(role: string | null | undefined): role is string {
  if (!role) return false;
  const normalizedRole = role.trim().toLowerCase();
  return normalizedRole === 'staff' || 
         normalizedRole === 'admin user' || 
         normalizedRole === 'adminuser' ||
         normalizedRole === 'super admin' || 
         normalizedRole === 'superadmin';
}