import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Status {
  statusId: number;
  name: string;
  abbreviation: string;
  description: string;
  groupId: number;
  isActive?: boolean;
  auditLogs?: AuditTrails[];
}
