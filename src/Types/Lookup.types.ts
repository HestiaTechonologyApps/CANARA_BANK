// src/Types/Common/Lookup.types.ts

export type LookupEntityName = "member" | "branch";

export interface MemberLookupItem {
  memberId: number;
  staffNo: number;
  memberName: string;
  branchName: string;
  isSelected: boolean;
}

export interface BranchLookupItem {
  branchId: number;
  dpCode: string;
  branchName: string;
  isSelected: boolean;
}

export interface LookupPagedParams {
  entityName: LookupEntityName;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  lookupMasterId?: number;   
  selectedId?: number | null;
}

export interface LookupPagedResponse<T> {
  total: number;
  data: T[];
}