export interface MemberAccountDetail {
  accountId: number;
  circleId: number;
  branchId: number;
  memeberId: number; 
  monthCode: number;
  yearOf: number;
  amount: number;
  transMode: number;
  reference: string;
  remark: string;
  circleName: string;
  branchName: string;
}

export interface MemberAccountsDetailsResponse {
  value: MemberAccountDetail[];
}