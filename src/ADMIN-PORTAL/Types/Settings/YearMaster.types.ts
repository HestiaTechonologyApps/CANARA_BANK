import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface YearMaster {
  yearOf?: number;       
  yearName: number;    
  isDeleted?: boolean;  
  auditLogs?: AuditTrails[];
}
