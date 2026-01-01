import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DeathClaim {
  deathClaimId: number;
  memberId: number;
  stateId: number;
  designationId: number;

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
