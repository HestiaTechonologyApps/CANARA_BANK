// ── Upload payload (multipart/form-data) ─────────────────────────
export interface ContributionUploadPayload {
  MonthCode: number;
  YearOf:    number;
  ContributionFile: File;
}

// ── Upload response (after upload-and-save) ───────────────────────
export interface ContributionUploadResponse {
  monthlyContributionId: number;
  contributionMasterId:  number;
  totalEntry:            number;
  totalAmount:           number;
  savedDetails:          number;
  errorCount:            number;
  errorLines:            string[];
}

// ── Contribution master list item (GET_ALL) ───────────────────────
export interface ContributionMaster {
  contributionMasterId:  number;
  fileName:              string;
  fileLocation:          string;
  fileType:              string;
  fileExtension:         string;
  fileSize:              number;
  month:                 string;
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

// ── Contribution detail item (GET_BY_ID paginated) ────────────────
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

// ── Paginated response wrapper for details ────────────────────────
export interface ContributionDetailPaginatedResponse {
  data:          ContributionDetail[];
  totalRecords:  number;
  pageNumber:    number;
  pageSize:      number;
  totalPages:    number;
  hasPrevious:   boolean;
  hasNext:       boolean;
}

// ── Query params for GET_BY_ID paginated ─────────────────────────
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

// ── Report type enum ──────────────────────────────────────────────
export type ContributionReportType =
  | "NEWMEMBERS"
  | "WRONGBRANCH"
  | "WRONGCIRCLE"
  | "PARKEDITEMS"
  | "ALL"
  | "DEFAULTER";

// ── Query params for GET_BY_REPORT ────────────────────────────────
export interface ContributionReportParams {
  id:          number;
  reportType:  ContributionReportType;
  pageNumber?: number;
  pageSize?:   number;
}

// ── Report response reuses the same paginated wrapper ─────────────
// ContributionDetailPaginatedResponse already covers this — no new type needed.
// Re-export as alias for clarity if desired:
export type ContributionReportResponse = ContributionDetailPaginatedResponse;