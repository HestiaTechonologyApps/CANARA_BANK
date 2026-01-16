import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface RefundContribution {
  refundContributionId: number;   
  staffNo: number;  
  memberId: number; 
  memberName: string;          
  stateId: number; 
  stateName: string;           
  designationId: number;  
  designationName: string;    
  deathDate: Date | string;      
  deathDateString: Date | string;       
  refundNO: string;            
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
