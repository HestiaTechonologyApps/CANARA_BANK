import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface ReportType {
  reportTypeId: number;
  reportTypeName: string;
  description: string;
  isActive: boolean;
  createdDate: Date | string;
  createdDateString: string;
  modifiedDate: Date | string;
  modifiedDateString: string;
  auditLogs?: AuditTrails[];
}
