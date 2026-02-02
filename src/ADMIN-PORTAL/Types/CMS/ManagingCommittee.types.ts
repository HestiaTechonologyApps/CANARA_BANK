import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface ManagingCommittee {
  managingComiteeId: number;
  managingComitteeName: string;
  position: string;
  description1: string;
  description2?: string;
  imageLocation?: string;
  order: number;
  companyId: number;
  companyName?: string;
  auditLogs?: AuditTrails[];
}
