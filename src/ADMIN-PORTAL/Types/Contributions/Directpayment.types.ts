import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DirectPayment {
  directPaymentId: number;
  memberId: number;
  memberName:string;
  amount: number;
  paymentDate: Date | string;
  paymentDatestring: string;
  paymentMode: string;
  referenceNo: string;
  remarks: string;
  createdByUserId: number;
  createdDate: Date | string;
  createdDatestring: string;
  isDeleted: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedDate?: Date | string;
  approvedDateString?: string;
  auditLogs?: AuditTrails[];
}

export interface ApproveDirectPaymentParams {
  approve: boolean;
  currentUserId: number;
}
