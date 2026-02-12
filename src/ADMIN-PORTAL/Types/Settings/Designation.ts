// src/Types/Settings/Designation.ts
import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Designation {
  designationId: number;
  name: string;
  description: string;
  auditLogs?: AuditTrails[];
}

// NEW: Add pagination types
export interface DesignationPaginationParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PagedDesignationResult {
  data: Designation[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}