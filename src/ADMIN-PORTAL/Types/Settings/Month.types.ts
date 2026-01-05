import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Month {
  monthId: number;        
  monthCode: number;       
  monthName: string;       
  abbrivation: string;      
  auditLogs?: AuditTrails[]; 
}
