// src/types/Claims/DirectPayment.types.ts

import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DirectPayment {
  directPaymentId: number;
  memberId: number;
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
  auditLogs?: AuditTrails[];
}
