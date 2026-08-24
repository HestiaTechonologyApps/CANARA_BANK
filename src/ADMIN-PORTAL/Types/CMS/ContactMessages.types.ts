import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface ContactMessage {
  contactMessageId: number;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  subject: string;
  message: string;
  submittedAt: Date | string;
  isRead: boolean;
  isReplied: boolean;
  adminNotes?: string | null;
  repliedAt?: Date | string | null;
  ipAddress: string;
  auditLogs?: AuditTrails[];
}
