import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Circle {
  circleId: number;            
  circleCode: number;          
  name: string;                
  abbreviation: string;        
  isActive: boolean;           

  stateId: number;             
  stateName: string;      

  dateFrom: Date | string;     
  dateFromString: string;   

  dateTo: Date | string;       
  dateToString: string;     

  auditLogs?: AuditTrails[];  
}
