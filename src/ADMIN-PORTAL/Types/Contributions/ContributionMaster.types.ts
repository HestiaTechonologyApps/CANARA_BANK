export interface ContributionMaster {
  contributionMasterId: number;
  fileName:             string;
  fileLocation:         string;
  fileType:             string;
  fileExtension:        string;
  fileSize:             number;
  month:                string;
  monthName:            string;
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
  yearOf:               number;
}

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
 
export interface ParkedItemsResponse {
  masterId:    number;
  totalCount:  number;
  totalPages:  number;
  pageNumber:  number;
  pageSize:    number;
  items:       ParkedDetailItem[];
}
 
export interface ParkedItemsParams {
  masterId:    number;
  pageNumber?: number;
  pageSize?:   number;
}

export interface ApproveParams {
  masterId:      number;   
  approve?:      boolean;  
  currentUserId?: number;  
}

export interface ApproveResponse {
  message:       string;
  approvedCount: number;
}