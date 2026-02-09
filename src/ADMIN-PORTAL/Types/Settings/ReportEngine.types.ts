// src/Types/ReportEngine/ReportEngine.types.ts

import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface ReportEngine {
  reportEngineId: number;
  name: string;
  description: string;
  sqlString: string;
  isActive: boolean;
  isDeleted: boolean;
  createdDate: Date | string;
  modifiedDate: Date | string;
  createdDateString: string;
  modifiedDateString: string;
  auditLogs?: AuditTrails[];
}

// export interface CreateReportEngineDto {
//   reportEngineId: number;
//   name: string;
//   description: string;
//   sqlString: string;
//   isActive: boolean;
//   isDeleted:boolean;
//   createdDate: Date | string;
//   modifiedDate: Date | string;
// }

// export interface UpdateReportEngineDto {
//   reportEngineId: number;
//   name: string;
//   description: string;
//   sqlString: string;
//   isActive: boolean;
//   isDeleted:boolean;
//   createdDate: Date | string;
//   modifiedDate: Date | string;
// }