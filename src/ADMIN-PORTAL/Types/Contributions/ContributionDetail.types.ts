// ── Single detail response (GET_BY_DETAIL_ID) ─────────────────────
export interface ContributionDetailItem {
  contributionDetailId: number;
  fullString:           string;
  circle:               number;
  month:                string;
  year:                 string;
  dpCode:               string;
  staffNo:              string;
  name:                 string;
  designation:          string;
  amount:               number;
  isParked:             boolean;
  contributionMasterId: number;
  parkReason:           string;
  parkedon:             string | null;
  unParkedon:           string | null;
  total:                string;
}

// ── Park request body ─────────────────────────────────────────────
export interface ParkPayload {
  parkReason: string;
}

// ── Unpark query params ───────────────────────────────────────────
export interface UnparkParams {
  detailId:      number;
  currentUserId: number;
}