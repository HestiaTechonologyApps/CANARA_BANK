// src/types/Settings/Designation.types.ts

import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Designation {
  designationId: number;
  name: string;
  description: string;
  auditLogs?: AuditTrails[];
}