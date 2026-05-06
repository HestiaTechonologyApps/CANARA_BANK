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