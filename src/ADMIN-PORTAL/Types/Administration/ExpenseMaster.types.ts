export interface ExpenseMaster {
  expenseMasterId: number;
  expenseTypeId: number;
  expenseTypeName?: string; 
  expenseDate: string;
  amount: number;
  paidTo: string;
  referenceNo: string;
  paymentMode: string;
  description: string;
  isDeleted: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedDate?: string;
  approvedDateString?: string;
  auditLogs?: any[];
}

export interface ExpenseMasterPayload {
  expenseMasterId: number; 
  expenseTypeId: number;
  expenseDate: string;
  amount: number;
  paidTo: string;
  referenceNo: string;
  paymentMode: string;
  description: string;
  isDeleted: boolean;
}

export interface ExpenseMasterPagedParams {
  expenseMasterId?: number;
  expenseTypeId?: number;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber: number;
  pageSize: number;
  getAll?: boolean;
}

export interface ApproveExpenseMasterParams {
  approve: boolean;
  currentUserId: number;
}