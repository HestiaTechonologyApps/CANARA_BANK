import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Circle {
  circleId: number;
  circleCode: number;
  name: string;
  abbreviation: string;
  isActive: boolean;
  stateId: number;
  dateFrom: Date | string;
  dateTo: Date | string;
  state: string;
  auditLogs?: AuditTrails[];
}
