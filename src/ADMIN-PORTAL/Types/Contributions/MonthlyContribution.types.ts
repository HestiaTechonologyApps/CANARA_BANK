// MonthlyContribution Types

export interface MonthlyContribution {
  monthlyContributionId?: number;
  fileName?: string;
  fileLocation?: string;
  fileType?: string;
  fileExtension?: string;
  fileSize?: number;
  monthCode?: number;
  monthId?: number;
  monthName?: string;
  yearOF?: number;
  yearOf?: number;
  yearName?: string;
  createdDate?: string;
  createdByUserId?: number;
  modifiedDate?: string;
  modifiedByUserId?: number;
}

export interface MonthlyContributionCreatePayload {
  YearOF: number;
  MonthId: number;
}

export interface MonthlyContributionFileInfo {
  monthlyContributionId: number;
  fileName: string;
  fileLocation: string;
  fileType: string;
  fileExtension: string;
  fileSize: number;
  monthCode: number;
  yearOf: number;
  createdDate: string;
  createdByUserId: number;
  modifiedDate: string;
  modifiedByUserId: number;
}

export interface MonthlyContributionUploadResponse {
  statusCode: number;
  error: string | null;
  customMessage: string | null;
  isSucess: boolean;
  value: MonthlyContributionFileInfo;
}

export interface MonthlyContributionCreateResponse {
  monthlyContributionId: number;
  yearOF: number;
  monthId: number;
  filePath?: string;
}