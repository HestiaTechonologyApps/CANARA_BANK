import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface RefundContribution {
  refundContributionId: number;   
  staffNo: number;                
  stateId: number;                
  designationId: number;          
  deathDate: Date | string;       
  deathDateString: Date | string;        
  refundNO: number;               
  branchNameOFTime: string;       
  dpcodeOfTime: string;           
  type: string;                  
  remark: string;                 
  ddno: string;                   
  dddate: Date | string;                 
  dddateString: Date | string;           
  amount: number;                 
  lastContribution: number;       
  yearOF: number;                 
  auditLogs?: AuditTrails[];  
}
