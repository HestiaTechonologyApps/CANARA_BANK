// src/Types/Settings/User.types.ts

import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
  passwordHash?: string; 
  isActive: boolean;
  islocked: boolean;
  createAt: Date | string;
  lastlogin: Date | string | null;
  role: string; // Added role property
  companyId: number;
  auditLogs?: AuditTrails[];
}

// Optional: Create a type for role values to ensure type safety
export type UserRole = 'Staff' | 'Admin User' | 'Super Admin';

// Optional: Create a more type-safe User interface
export interface TypedUser extends Omit<User, 'role'> {
  role: UserRole;
}