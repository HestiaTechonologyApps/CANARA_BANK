// src/types/Auth.types.ts
import type { AuditTrails } from "./AuditLog.types";

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  staffNo: number;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  address?: string;
  password: string;
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  staffNo: number;
  memberId?: number;
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
  role: string; 
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

export function isValidUserRole(role: string | null | undefined): role is string {
  if (!role) return false;
  const normalizedRole = role.trim().toLowerCase();
  return normalizedRole === 'staff' || 
         normalizedRole === 'admin user' || 
         normalizedRole === 'adminuser' ||
         normalizedRole === 'super admin' || 
         normalizedRole === 'superadmin';
}