import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  staffNo: number;
  memberId?: number; 
  phoneNumber: string;
  address: string;
  passwordHash?: string;
  isActive: boolean;
  islocked: boolean;
  createAt: Date | string;
  lastlogin: Date | string | null;
  role: string;
  companyId: number;
  auditLogs?: AuditTrails[];
}

// New interface for password change
export interface ChangePasswordRequest {
  userId: number;
  oldPassword: string;
  newPassword: string;
}

export type UserRole = 'Staff' | 'Admin User' | 'Super Admin';

export interface TypedUser extends Omit<User, 'role'> {
  role: UserRole;
}