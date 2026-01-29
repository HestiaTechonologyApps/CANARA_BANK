import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface CircleState {
  circleId: number;
  stateId: number;
  createdByUserId: number;
  createdDate: Date | string;
  modifiedByUserId: number;
  modifiedDate: Date | string;
  auditLogs?: AuditTrails[];
}
