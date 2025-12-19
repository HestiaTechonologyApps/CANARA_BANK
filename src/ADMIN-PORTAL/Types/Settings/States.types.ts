// src/types/Settings/State.types.ts

import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface State {
  circleId: number;
  circleCode: number;
  name: string;
  abbreviation: string;
  isActive: boolean;
  stateId: number;
  dateFrom: Date | string;
  dateTo: Date | string;
  state: string;
  auditLogs?: AuditTrails[];
}
