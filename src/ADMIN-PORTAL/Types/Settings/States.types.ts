import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface State {
  stateId: number;
  name: string;
  abbreviation: string;
  isActive: boolean;
  isDeleted?: boolean;
  auditLogs?: AuditTrails[];
}
