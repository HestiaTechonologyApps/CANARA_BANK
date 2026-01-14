import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DeathClaim {
  deathClaimId: number;
  memberId: number;
  memberName: string;
  stateId: number;
  stateName: string;
  designationId: number;
  designationName: string;
  deathDate: Date | string;    
  nominee: string;            
  nomineeRelation: string;    
  nomineeIDentity: string;    
  ddno: string;               
  dddate: Date | string;      
  amount: number;             
  lastContribution: number;   
  yearOF: number;             
  auditLogs?: AuditTrails[];
}
