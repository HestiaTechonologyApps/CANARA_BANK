import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Reports {
  reportId: number;
  reportType: string;
  yearOf?: number;
  yearName: string;
  monthCode: number;
  monthName: string;
  circleId: number;
  circleName: string;
  branchId: number;
  dpCode: number;
  branchName: string;
  memberId: number;
  memberName: string;
  staffNo: number;
  createdDate: Date | string;
  createdDateString: string;
  modifiedDate: Date | string;
  modifiedDateString: string;
  isActive: boolean;
  auditLogs?: AuditTrails[];
}
