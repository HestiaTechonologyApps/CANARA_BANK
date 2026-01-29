import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface SupportTicket {
  supportTicketId: number;
  supportTicketNum: string;
  description: string;
  priority: string;
  duration: string;
  developerRemark?: string;
  isApproved: boolean;
  approvedByUserId?: number;
  approvedDate?: Date | string;
  approvedDateSting?: string;
  auditLogs?: AuditTrails[];
}
