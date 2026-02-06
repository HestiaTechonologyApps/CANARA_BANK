import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Member {
  memberId: number;
  staffNo: number;
  designationId: number;
  designationName?:string;
  categoryId: number;
  branchName?:string;
  branchId: number;
  categoryname?:string;
  name: string;
  genderId: number;
  gender?:string;
  dpCode?:string;
  dob: Date | string; 
  dobString?: string;
  doj: Date | string; 
  dojString?: string;
  dojtoScheme: Date | string; 
  dojtoSchemeString?: string;
  statusId: number;
  status?:string;
  isRegCompleted: boolean;
  createdByUserId: number;
  createdDate: Date | string;
  createdDateString: Date | string;
  modifiedByUserId: number;
  modifiedDate: Date | string;
  modifiedDateString: string;
  nominee: string;
  profileImageSrc?: string;
  nomineeRelation: string;
  nomineeIDentity: string;
  unionMember: string;
  totalRefund: string;
  auditLogs?: AuditTrails[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface MemberPaginationParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}