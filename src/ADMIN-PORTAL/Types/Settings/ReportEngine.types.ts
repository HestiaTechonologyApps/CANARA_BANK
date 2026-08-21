import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface ReportEngine {
  reportEngineId: number;
  name: string;
  description: string;
  sqlString: string;
  isActive: boolean;
  isDeleted: boolean;
  createdDate: Date | string;
  modifiedDate: Date | string;
  createdDateString: string;
  modifiedDateString: string;
  auditLogs?: AuditTrails[];
}



