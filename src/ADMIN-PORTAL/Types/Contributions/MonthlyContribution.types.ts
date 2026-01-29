import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface MonthlyContribution {
  monthlyContributionId: number;
  fileName: string;
  fileLocation: string;
  fileType: string;
  fileExtension: string;
  fileSize: number;
  monthCode: number;
  monthName?: string;  
  yearOf: number;
  yearName?: number;    
  createdDate: Date | string;
  createdByUserId: number;
  modifiedDate: Date | string;
  modifiedByUserId: number;
  auditLogs?: AuditTrails[];    
}
