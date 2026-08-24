export interface ExpenseType {
  expenseTypeId: number;
  name: string;
  description: string;
  isDeleted: boolean;
  auditLogs?: any[];
}

export interface ExpenseTypePayload {
  expenseTypeId: number; 
  name: string;
  description: string;
  isDeleted: boolean;
}