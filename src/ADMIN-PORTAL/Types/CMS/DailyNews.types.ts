import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DailyNews {
  dailyNewsId: number;          
  title: string;                
  description: string;          
  newsDate: Date | string;      
  newsDateString:string
  companyId: number;            
  isActive: boolean;           
  isDeleted: boolean;           
  createdOn: Date | string;     
  createdBy: string;           
  auditLogs?: AuditTrails[];     
}
