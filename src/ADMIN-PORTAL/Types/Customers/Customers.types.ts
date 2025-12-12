import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Customer {
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  dob: Date | string;
  nationalilty?: string; // matches API spelling
  nationality?: string; // correct spelling
  createdAt: Date | string;
  isActive: boolean;
  companyId: number;
  isDeleted: boolean;
  auditLogs?: AuditTrails[];
}