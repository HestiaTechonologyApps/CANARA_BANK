import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface UserRoleRight {
  userRoleRightId: number;
  controllerName: Date | string;
  controllerNameString: Date | string;

  actionName: string;
  userTypeID: number;

  auditLogs?: AuditTrails[];
}
