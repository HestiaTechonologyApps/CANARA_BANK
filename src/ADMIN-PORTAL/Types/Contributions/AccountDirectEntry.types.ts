import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface AccountDirectEntry {
  accountsDirectEntryID: number;
  memberId: number;
  memberName?:string;
  name: string;
  branchId: number;
  branchName?:string;
  monthName?:string;
  monthCode: number;
  yearOf?: number;
  ddIba: string;
  ddIbaDate: Date | string;
  ddIbaDateString?:string;
  amt: number;
  enrl: string;
  fine: string;
  f9: string;
  f10: string;
  f11: string;
  status: string;
  isApproved: boolean;
  approvedBy: string;
  approvedDate: Date | string;
  approvedDateString?:string;
  auditLogs?: AuditTrails[];
}
