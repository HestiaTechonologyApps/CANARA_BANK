// src/types/Settings/Category.types.ts

import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Category {
  categoryId: number;
  name: string;
  abbreviation: string;
  auditLogs?: AuditTrails[];
}