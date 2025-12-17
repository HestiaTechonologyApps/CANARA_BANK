// src/Types/CMS/DailyNews.types.ts

import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface DailyNews {
  dailyNewsId: number;          // e.g., 0
  title: string;                // e.g., "string"
  description: string;          // e.g., "string"
  newsDate: Date | string;      // e.g., "2025-12-17T07:21:57.965Z"
  companyId: number;            // e.g., 0
  isActive: boolean;            // true / false
  isDeleted: boolean;           // true / false
  createdOn: Date | string;     // e.g., "2025-12-17T07:21:57.965Z"
  createdBy: string;            // e.g., "string"
  auditLogs?: AuditTrails[];     // optional audit trail entries
}
