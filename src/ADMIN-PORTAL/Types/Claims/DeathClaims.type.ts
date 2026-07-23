import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DeathClaim {
  deathClaimId: number;
  staffNo:string;
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
  yearOF?: number;
  yearName:number;
  isApproved: boolean;
  approvedBy?: string;
  approvedDate?: Date | string;
  approvedDateString?: string;
  auditLogs?: AuditTrails[];
}

export interface ApproveDeathClaimParams{
  approve: boolean;
  currentUserId: number;
}

