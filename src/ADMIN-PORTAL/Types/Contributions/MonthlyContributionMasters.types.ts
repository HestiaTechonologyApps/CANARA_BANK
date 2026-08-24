export interface ContributionUploadPayload {
  MonthCode: number;
  YearOf:    number;
  ContributionFile: File;
}

export interface ContributionUploadResponse {
  monthlyContributionId: number;
  contributionMasterId:  number;
  totalEntry:            number;
  totalAmount:           number;
  savedDetails:          number;
  errorCount:            number;
  errorLines:            string[];
}

export interface MonthlyContributionMaster {
  contributionMasterId:  number;
  fileName:              string;
  fileLocation:          string;
  fileType:              string;
  fileExtension:         string;
  fileSize:              number;
  month:                 string;
  monthName:             string;
  year:                  string;
  circle:                string;
  totalAmount:           string;
  totalEntry:            string;
  contributionStatus:    string;
  newMemberCount:        string;
  approvedBy:            string;
  approvedDate:          string;
  isApproved:            boolean;
}

export interface ContributionDetail {
  contributionDetailId:  number;
  fullString:            string;
  circle:                number;
  month:                 string;
  year:                  string;
  dpCode:                string;
  staffNo:               string;
  name:                  string;
  designation:           string;
  amount:                number;
  isParked:              boolean;
  contributionMasterId:  number;
  parkReason:            string;
  parkedon:              string | null;
  unParkedon:            string | null;
  total:                 string;
}

export interface ContributionDetailPaginatedResponse {
  data:          ContributionDetail[];
  totalRecords:  number;
  pageNumber:    number;
  pageSize:      number;
  totalPages:    number;
  hasPrevious:   boolean;
  hasNext:       boolean;
}

export interface ContributionDetailParams {
  id:             number;
  PageNumber?:    number;
  PageSize?:      number;
  GetAll?:        boolean;
  StaffNo?:       string;
  Name?:          string;
  DpCode?:        string;
  IsParked?:      boolean;
  SearchTerm?:    string;
  SortBy?:        string;
  SortDescending?: boolean;
}

export type ContributionReportType =
  | "NEWMEMBERS"
  | "WRONGBRANCH"
  | "WRONGCIRCLE"
  | "PARKEDITEMS"
  | "ALL"
  | "DEFAULTER";

export interface ContributionReportParams {
  id:          number;
  reportType:  ContributionReportType;
  pageNumber?: number;
  pageSize?:   number;
}

export interface ContributionUpdatePayload {
  id:               number;   // path param
  MonthCode:        number;
  YearOf:           number;
  ContributionFile: File;
}

export interface ContributionUpdateResponse {
  contributionMasterId: number;
  totalEntry:           number;
  totalAmount:          number;
  savedDetails:         number;
  newMemberCount:       number;
  errorCount:           number;
  errorLines:           string[];
}

export type ContributionReportResponse = ContributionDetailPaginatedResponse;