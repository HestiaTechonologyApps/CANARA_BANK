import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DayQuote {
  dayQuoteId: number;
  day: number;
  monthCode: number;
  toDayQuote: string;
  unformatedContent: string;
  auditLogs?: AuditTrails[];
}
