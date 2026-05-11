export interface ContributionMaster {
  contributionMasterId: number;
  fileName:             string;
  fileLocation:         string;
  fileType:             string;
  fileExtension:        string;
  fileSize:             number;
  month:                string;
  year:                 string;
  circle:               string;
  totalamount:          string;
  totalentry:           string;
  newMemberCount:       string;
  contributionStatus:   string;
  isApproved:           boolean;
  approvedBy:           string;
  approvedDate:         string;
  contributionDetails:  null;
}

// ── Single parked detail item (from GET_PARKED items array) ──────────
export interface ParkedDetailItem {
  contributionDetailId: number;
  contributionMasterId: number;
  fullString:           string;
  circle:               number;
  month:                string;
  year:                 string;
  dpCode:               string;
  staffNo:              string;
  name:                 string;
  designation:          string;
  amount:               number;
  total:                string;
  parkReason:           string;
}
 
// ── Paginated response for GET_PARKED ────────────────────────────────
export interface ParkedItemsResponse {
  masterId:    number;
  totalCount:  number;
  totalPages:  number;
  pageNumber:  number;
  pageSize:    number;
  items:       ParkedDetailItem[];
}
 
// ── Query params for GET_PARKED ──────────────────────────────────────
export interface ParkedItemsParams {
  masterId:    number;
  pageNumber?: number;
  pageSize?:   number;
}

// ── Approve params ───────────────────────────────────────────────────
export interface ApproveParams {
  masterId:      number;   // path param (int64)
  approve?:      boolean;  // query param
  currentUserId?: number;  // query param (int32)
}

// ── Approve response ─────────────────────────────────────────────────
export interface ApproveResponse {
  message:       string;
  approvedCount: number;
}