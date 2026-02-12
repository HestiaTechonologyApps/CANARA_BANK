// src/Types/Settings/Designation.ts
import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Designation {
  designationId: number;
  name: string;
  description: string;
  auditLogs?: AuditTrails[];
}

// Matches backend DesignationPaginationParams : BasePaginationParams
export interface DesignationPaginationParams {
  // From BasePaginationParams
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  
  // Designation-specific filters
  designationId?: number;
  name?: string;
  description?: string;
}

export interface PagedDesignationResult {
  data: Designation[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}