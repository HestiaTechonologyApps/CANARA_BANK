// types/memberAccountsDetails.types.ts

export interface MemberAccountDetail {
  accountId: number;
  circleId: number;
  branchId: number;
  memeberId: number; // Note: typo in API response (memeber instead of member)
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