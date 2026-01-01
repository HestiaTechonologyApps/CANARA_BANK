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
  role: string;  
  companyId: number;
  auditLogs?: AuditTrails[];
}