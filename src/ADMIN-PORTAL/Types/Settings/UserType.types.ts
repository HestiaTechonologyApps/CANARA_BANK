import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface UserType {
  userTypeId: number;       
  abbreviation: string;     
  description: string;     
  auditLogs?: AuditTrails[]; 
}
