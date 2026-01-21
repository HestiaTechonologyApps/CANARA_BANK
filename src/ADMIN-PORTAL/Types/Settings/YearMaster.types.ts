import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface YearMaster {
  yearOf?: number;       
  yearName: number;      
  auditLogs?: AuditTrails[];
}
