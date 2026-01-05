import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Branch {
  branchId: number;           
  dpCode: number;             
  name: string;              
  address1: string;           
  address2: string;           
  address3: string;           
  district: string;          
  status: boolean;             
  circleId: number;           
  stateId: number;           
  isRegCompleted: boolean;    
  auditLogs?: AuditTrails[];          
}
