// src/constants/apiEndpoints.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cbeugjfws.co.in/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/Auth/login`,
    LOGOUT: `${API_BASE_URL}/Auth/logout`,
    CHANGE_PASSWORD: `${API_BASE_URL}/Auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/Auth/forgot-password`,
    REGISTER:`${API_BASE_URL}/Auth/register`
  },
USER_REGISTRATION: {
    GET_PENDING: `${API_BASE_URL}/UserRegistration/pending`,
    GET_ALL: `${API_BASE_URL}/UserRegistration/all`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/UserRegistration/${id}`,
    APPROVE: (id: number, approve: boolean, currentUserId: number, rejectReason?: string) =>
      `${API_BASE_URL}/UserRegistration/${id}/approve?approve=${approve}&currentUserId=${currentUserId}${
        rejectReason ? `&rejectReason=${encodeURIComponent(rejectReason)}` : ""
      }`,
  },
  AUDIT_LOG: {
    GET_BY_TABLE_AND_ID: (tableName: string, recordId: number) =>
      `${API_BASE_URL}/AuditLog/${tableName}/${recordId}`
  },
LOOKUP: {
  PAGED: `${API_BASE_URL}/Lookup/paged`
},
  //DASHBOARD
  DASHBOARD:{
   GET_ALL:`${API_BASE_URL}/Dashboard`,
   GET_OVERVIEW:`${API_BASE_URL}/Dashboard/overview`,
   GET_MONTHLY_CONTRIBUTION:`${API_BASE_URL}/Dashboard/monthly-contributions-vs-claims`,
   GET_CLAIM:`${API_BASE_URL}/Dashboard/claim-type-distribution`,
   GET_STATE:`${API_BASE_URL}/Dashboard/state-wise-membership`,
   GET_TOP_PERFORMING:`${API_BASE_URL}/Dashboard/top-performing-states`,
   GET_RECENT_ACTIVITIES:`${API_BASE_URL}/Dashboard/recent-activities`,
   GET_FINANCIAL:`${API_BASE_URL}/Dashboard/monthly-financial-comparison`,
   GET_CONTRIBUTION:`${API_BASE_URL}/Dashboard/contribution-trends`,
  },
  //SETTINGS
  STATE: {
    GET_ALL: `${API_BASE_URL}/State`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/State/${id}`,
    CREATE: `${API_BASE_URL}/State`,
    UPDATE: (id: number) => `${API_BASE_URL}/State/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/State/${id}`,
  },
  CIRCLE: {
    GET_ALL: `${API_BASE_URL}/Circle`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Circle/${id}`,
    CREATE: `${API_BASE_URL}/Circle`,
    UPDATE: (id: number) => `${API_BASE_URL}/Circle/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Circle/${id}`,
  },
  BRANCH: {
    GET_ALL: `${API_BASE_URL}/Branch`,
    GET_PAGED: `${API_BASE_URL}/Branch/paged`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Branch/${id}`,
    CREATE: `${API_BASE_URL}/Branch`,
    UPDATE: (id: number) => `${API_BASE_URL}/Branch/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Branch/${id}`,
    GET_BY_STATE_ID: (stateId: number) => `${API_BASE_URL}/Branch/circles-by-state/${stateId}`,
  },
  CATEGORY: {
    GET_ALL: `${API_BASE_URL}/Category`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Category/${id}`,
    CREATE: `${API_BASE_URL}/Category`,
    UPDATE: (id: number) => `${API_BASE_URL}/Category/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Category/${id}`,
  },
  COMPANY: {
    GET_ALL: `${API_BASE_URL}/Company/GetAll/admin-getall-company`,
    GET: `${API_BASE_URL}/Company/GetCompanyLookUp/admin-lookUp-company`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Company/GetById/${id}`,
    CREATE: `${API_BASE_URL}/Company/Create`,
    UPDATE: (id: number) => `${API_BASE_URL}/Company/Update/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Company/Delete/${id}`,
    UPLOAD_FILE:`${API_BASE_URL}/Company/UploadCompanyLogo/upload-company-logo`,
  },
  DESIGNATION: {
    GET_ALL: `${API_BASE_URL}/Designation`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Designation/${id}`,
    CREATE: `${API_BASE_URL}/Designation`,
    UPDATE: (id: number) => `${API_BASE_URL}/Designation/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Designation/${id}`,
    GET_PAGINATED: `${API_BASE_URL}/Designation/pagination`,
  },
  MONTH: {
    GET_ALL: `${API_BASE_URL}/Month`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Month/${id}`,
    CREATE: `${API_BASE_URL}/Month`,
    UPDATE: (id: number) => `${API_BASE_URL}/Month/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Month/${id}`,
  },
  REPORT_ENGINE:{
    GET_ALL:`${API_BASE_URL}/ReportEngine`,
    CREATE:`${API_BASE_URL}/ReportEngine`,
    GET_BY_ID:(id:number) => `${API_BASE_URL}/ReportEngine/${id}`,
    UPDATE:(id:number) => `${API_BASE_URL}/ReportEngine/${id}`,
    DELETE:(id:number) => `${API_BASE_URL}/ReportEngine/${id}`,
  },
  REPORT_TYPE:{
    GET_ALL:`${API_BASE_URL}/ReportType`,
    CREATE:`${API_BASE_URL}/ReportType`,
    GET_BY_ID:(id:number) => `${API_BASE_URL}/ReportType/${id}`,
    UPDATE:(id:number) => `${API_BASE_URL}/ReportType/${id}`,
    DELETE:(id:number) => `${API_BASE_URL}/ReportType/${id}`,
  },
  STATUS: {
    GET_ALL: `${API_BASE_URL}/Status`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Status/${id}`,
    CREATE: `${API_BASE_URL}/Status`,
    UPDATE: (id: number) => `${API_BASE_URL}/Status/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Status/${id}`,
  },
  USER: {
    GET_ALL: `${API_BASE_URL}/User`,
    GET_PAGED: `${API_BASE_URL}/User/paged`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/User/${id}`,
    CREATE: `${API_BASE_URL}/User`,
    UPDATE: (id: number) => `${API_BASE_URL}/User/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/User/${id}`,
    CHANGE_PASSWORD: `${API_BASE_URL}/User/ChangePassWord`,
    UPDATE_PARTIALLY: (id: number) => `${API_BASE_URL}/User/${id}/update-partially`,
    // UPLOAD_PROFILE_PIC: `${API_BASE_URL}/User/upload-profile-pic`,
  },
  USER_TYPE: {
    GET_ALL: `${API_BASE_URL}/UserType`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/UserType/${id}`,
    CREATE: `${API_BASE_URL}/UserType`,
    UPDATE: (id: number) => `${API_BASE_URL}/UserType/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/UserType/${id}`,
  },
  YEAR_MASTER: {
    GET_ALL: `${API_BASE_URL}/YearMaster`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/YearMaster/${id}`,
    CREATE: `${API_BASE_URL}/YearMaster`,
    UPDATE: (id: number) => `${API_BASE_URL}/YearMaster/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/YearMaster/${id}`,
  },
  //CONTRIBUTIONS
  ACCOUNT_DIRECT_ENTRY: {
    GET_ALL: `${API_BASE_URL}/AccountDirecyEntry`,
    GET_PAGED: `${API_BASE_URL}/AccountDirecyEntry/paged`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/AccountDirecyEntry/${id}`,
    CREATE: `${API_BASE_URL}/AccountDirecyEntry`,
    UPDATE: (id: number) => `${API_BASE_URL}/AccountDirecyEntry/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/AccountDirecyEntry/${id}`,
    GET_BY_STAFFID: (id: number) => `${API_BASE_URL}/AccountDirecyEntry/GetByMemberId${id}`,
    UPDATE_BY_APPROVE:(id: number) => `${API_BASE_URL}/AccountDirecyEntry/approve/${id}`,
  },
  DIRECT_PAY: {
    GET_ALL: `${API_BASE_URL}/DirectPayment`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DirectPayment/${id}`,
    CREATE: `${API_BASE_URL}/DirectPayment`,
    UPDATE: (id: number) => `${API_BASE_URL}/DirectPayment/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DirectPayment/${id}`,
    UPDATE_BY_APPROVE: (id: number) => `${API_BASE_URL}/DirectPayment/approve/${id}`
  },
  MEMBER: {
    GET_ALL: `${API_BASE_URL}/Member`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Member/${id}`,
    CREATE: `${API_BASE_URL}/Member`,
    UPDATE: (id: number) => `${API_BASE_URL}/Member/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Member/${id}`,
    UPLOAD_PROFILE_PIC: `${API_BASE_URL}/Member/upload-profile-pic`,
    GET_ALL_PAGINETED: `${API_BASE_URL}/Member/paged`,
    GET_STATUS_FILTER:`${API_BASE_URL}/Member/statuses`,
  },
  MONTHLY_CONTRIBUTION:{
    GET_ALL:`${API_BASE_URL}/MonthlyContribution`,
    GET_BY_ID:(id:number)=>`${API_BASE_URL}/MonthlyContribution/${id}`,
    CREATE:`${API_BASE_URL}/MonthlyContribution`,
    UPDATE:(id:number)=>`${API_BASE_URL}/MonthlyContribution/${id}`,
    DELETE:(id:number)=>`${API_BASE_URL}/MonthlyContribution/${id}`,
    UPLOAD_FILE:`${API_BASE_URL}/MonthlyContribution/upload-file`,
  },
  //Monthly Contribution
  MONTHLY_CONTRIBUTION_MASTERS:{
   CREATE:`${API_BASE_URL}/MonthlyContribution/upload-and-save`,
   UPDATE:(id: number)=>`${API_BASE_URL}/MonthlyContribution/${id}/update-contribution`,
   GET_BY_ID:(id:number)=>`${API_BASE_URL}/MonthlyContribution/${id}/details`,
   GET_ALL:`${API_BASE_URL}/MonthlyContribution/ContributionMasters`,
   GET_BY_REPORT:(id: number) => `${API_BASE_URL}/MonthlyContribution/${id}/report`,
  },
  CONTRIBUTION_MASTER:{
   GET_ALL:`${API_BASE_URL}/ContributionMaster/getall-forwarded-contributions`,
   GET_MASTER_ID: (masterId: number) => `${API_BASE_URL}/ContributionMaster/${masterId}`,
   DELETE:(masterId: number) => `${API_BASE_URL}/ContributionMaster/${masterId}`,
   FORWARD: (masterId: number) => `${API_BASE_URL}/ContributionMaster/${masterId}/forward`,
   GET_PARKED:(masterId:number)=>`${API_BASE_URL}/ContributionMaster/${masterId}/parked`,
   APPROVE: (masterId: number) => `${API_BASE_URL}/ContributionMaster/${masterId}/approve`,
  },
  MEMBER_ACCOUNTS_DETAILS:{
    GET_BY_ID:(id: number)=>`${API_BASE_URL}/MemberAccountsDetails/${id}`,
  },
  CONTRIBUTION_DETAIL: {
   GET_BY_DETAIL_ID: (detailId: number) => `${API_BASE_URL}/ContributionDetail/${detailId}`,
   CREATE_PARK: (detailId: number) => `${API_BASE_URL}/ContributionDetail/${detailId}/park`,
   CREATE_UNPARK: (detailId: number) => `${API_BASE_URL}/ContributionDetail/${detailId}/unpark`,
  },
  //CLAIMS
  DEATH_CLAIMS: {
    GET_ALL: `${API_BASE_URL}/DeathClaim`,
    GET_PAGED: `${API_BASE_URL}/DeathClaim/paged`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
    CREATE: `${API_BASE_URL}/DeathClaim`,
    UPDATE: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
    UPDATE_BY_APPROVE: (id: number) => `${API_BASE_URL}/DeathClaim/approve/${id}`,
  },
REFUND_CONTRIBUTION: {
    GET_ALL: `${API_BASE_URL}/RefundContribution`,
    GET_PAGED: `${API_BASE_URL}/RefundContribution/paged`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/RefundContribution/${id}`,
    CREATE: `${API_BASE_URL}/RefundContribution`,
    UPDATE: (id: number) => `${API_BASE_URL}/RefundContribution/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/RefundContribution/${id}`,
    GET_BY_MEMBER_ID:(id: number) => `${API_BASE_URL}/RefundContribution/RefundByMemberId/${id}`,
    UPDATE_BY_APPROVE:(id : number) => `${API_BASE_URL}/RefundContribution/approve/${id}`,
    GET_MEMBER_ELIGIBILITY: (memberId: number, excludeRefundContributionId?: number) =>
      `${API_BASE_URL}/RefundContribution/member-eligibility/${memberId}${
        excludeRefundContributionId ? `?excludeRefundContributionId=${excludeRefundContributionId}` : ""
      }`,
    GET_NUM: (stateId: number) =>`${API_BASE_URL}/RefundContribution/next-refund-no/${stateId}`,
  },
  //CMS
  ATTACHMENT: {
    GET_BY_TABLE_AND_ID: (tableName: string, recordId: number) => `${API_BASE_URL}/Attachment/${tableName}/${recordId}`,
    GET_BY_ID: (attachmentId: number) => `${API_BASE_URL}/Attachment/${attachmentId}`,
    UPLOAD: `${API_BASE_URL}/Attachment/upload`,
    DELETE: (attachmentId: number) => `${API_BASE_URL}/Attachment/${attachmentId}`,
    //GET: `${API_BASE_URL}/Attachment`,
    DOWNLOAD: (attachmentId: number) => `${API_BASE_URL}/Attachment/download/${attachmentId}`,
    UPDATE:(id:number)=>`${API_BASE_URL}/Attachment/${id}`
  },
  CONTACT_MESSAGE: {
   GET_ALL: `${API_BASE_URL}/ContactMessage`,
   GET_BY_ID: (id: number) => `${API_BASE_URL}/ContactMessage/${id}`,
   CREATE: `${API_BASE_URL}/ContactMessage/submit`,
   MARK_AS_READ: (id: number) => `${API_BASE_URL}/ContactMessage/${id}/mark-read`,
   MARK_AS_REPLIED: (id: number) => `${API_BASE_URL}/ContactMessage/${id}/mark-replied`,
  },
  DAILY_NEWS: {
    GET_ALL: `${API_BASE_URL}/DailyNews`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DailyNews/${id}`,
    CREATE: `${API_BASE_URL}/DailyNews`,
    UPDATE: (id: number) => `${API_BASE_URL}/DailyNews/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DailyNews/${id}`,
  },
  MANAGING_COMMITTEE: {
    GET_ALL: `${API_BASE_URL}/ManagingComitee`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/ManagingComitee/${id}`,
    CREATE: `${API_BASE_URL}/ManagingComitee`,
    UPDATE: (id: number) => `${API_BASE_URL}/ManagingComitee/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/ManagingComitee/${id}`,
    UPLOAD_IMAGE:`${API_BASE_URL}/ManagingComitee/upload-image`,
  },
  PUBLIC_PAGE: {
    GET_ALL: `${API_BASE_URL}/PublicPage/public/home`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/PublicPage/${id}`,
    CREATE: `${API_BASE_URL}/PublicPage`,
    UPDATE: (id: number) => `${API_BASE_URL}/PublicPage/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/PublicPage/${id}`
  },
  DAY_QUOTE: {
    GET_ALL: `${API_BASE_URL}/DayQuote`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DayQuote/${id}`,
    CREATE: `${API_BASE_URL}/DayQuote`,
    UPDATE: (id: number) => `${API_BASE_URL}/DayQuote/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DayQuote/${id}`,
  },
  //REPORTS
  REPORTS:{
    GET_ALL:`${API_BASE_URL}/Report`,
    CREATE:`${API_BASE_URL}/Report`,
    GET_BY_ID:(id: number) => `${API_BASE_URL}/Report/${id}`,
    UPDATE:(id: number)=> `${API_BASE_URL}/Report/${id}`,
    DELETE:(id: number)=>`${API_BASE_URL}/Report/${id}`,
  },
  //SUPPORT TICKETS
  SUPPORT_TICKET: {
    GET_ALL: `${API_BASE_URL}/SupportTicket`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/SupportTicket/${id}`,
    CREATE: `${API_BASE_URL}/SupportTicket`,
    UPDATE: (id: number) => `${API_BASE_URL}/SupportTicket/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/SupportTicket/${id}`,
    GET_NUMBER:`${API_BASE_URL}/SupportTicket/next-ticket-num`,
  },
  //ADMINISTRATIONS
  EXPENSE_MASTER:{
   GET_ALL:`${API_BASE_URL}/ExpenseMaster`,
   GET_BY_ID:(id:number)=>`${API_BASE_URL}/ExpenseMaster/${id}`,
   CREATE:`${API_BASE_URL}/ExpenseMaster`,
   UPDATE:(id:number)=>`${API_BASE_URL}/ExpenseMaster/${id}`,
   DELETE:(id:number)=>`${API_BASE_URL}/ExpenseMaster/${id}`,
   GET_ALL_PAGINATED:`${API_BASE_URL}/ExpenseMaster/paged`,
   UPDATE_BY_APPROVE: (id: number) => `${API_BASE_URL}/ExpenseMaster/approve/${id}`,
  },
  EXPENSE_TYPE:{
   GET_ALL:`${API_BASE_URL}/ExpenseType`, 
   GET_BY_ID:(id:number)=>`${API_BASE_URL}/ExpenseType/${id}`,
   CREATE:`${API_BASE_URL}/ExpenseType`,
   UPDATE:(id:number)=>`${API_BASE_URL}/ExpenseType/${id}`,
   DELETE:(id:number)=>`${API_BASE_URL}/ExpenseType/${id}`,
  },
  USER_ROLE_RIGHT: {
    GET_ALL: `${API_BASE_URL}/UserRoleRight`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/UserRoleRight/${id}`,
    CREATE: `${API_BASE_URL}/UserRoleRight`,
    UPDATE: (id: number) => `${API_BASE_URL}/UserRoleRight/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/UserRoleRight/${id}`,
  },
  //------------------------PUBLIC MODULE----------------------------------------
   CLAIM_SETTLED:{
   GET:`${API_BASE_URL}/ClaimsSettled/claims-settled-stats`,
  },
  PUBLIC: {
    GET_ALL_DAYQUOTE: `${API_BASE_URL}/Public/dayquotes`,
    GET_ALL_DAILYNEWS: `${API_BASE_URL}/Public/dailynews`,
    GET_ALL_MANAGINGCOMMITEE: `${API_BASE_URL}/Public/managingCommitee`,
    GET_ALL_PUBLICPAGE: `${API_BASE_URL}/Public/publicpage`,
    GET_ALL_ATTACHMENTS: `${API_BASE_URL}/Public/attachment`,
    GET_ATTACHMENTS_BY_ID: (id: number)=> `${API_BASE_URL}/Public/download/${id}`,
  },
};

// ✅ Helper function to get full image URL - FIXED VERSION
export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  console.log('getFullImageUrl called with:', imagePath);
  
  if (!imagePath) {
    console.log('No image path provided');
    return '';
  }

  // If already a complete URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('Already a full URL:', imagePath);
    return imagePath;
  }

  // If it's a blob URL (from file upload preview), return as is
  if (imagePath.startsWith('blob:')) {
    console.log('Blob URL detected:', imagePath);
    return imagePath;
  }

  // If it's a placeholder URL pattern or local asset
  if (imagePath.includes('placeholder') || imagePath.includes('/assets/') || imagePath.includes('/Assets/')) {
    console.log('Placeholder or asset URL detected:', imagePath);
    return imagePath;
  }

  // ✅ FIXED: Always use the backend server URL directly
  // This ensures images work regardless of which port the frontend is running on
  const backendUrl = 'http://sreenathganga-001-site16.jtempurl.com';
  console.log('Backend URL:', backendUrl);

  // Ensure proper path construction - remove leading slash from imagePath if present
  const cleanPath = imagePath.replace(/^\/+/, '');
  const fullUrl = `${backendUrl}/${cleanPath}`;
  
  console.log('Final full URL:', fullUrl);
  return fullUrl;
};

// ✅ Get base website URL (without /api)
export const getBaseWebsiteUrl = (): string => {
  const baseUrl = API_BASE_URL.replace('/api', '');
  return baseUrl;
};