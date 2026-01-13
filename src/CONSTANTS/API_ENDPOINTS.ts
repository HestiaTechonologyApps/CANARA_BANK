// src/constants/apiEndpoints.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://sreenathganga-001-site16.jtempurl.com/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/Auth/login`,
    LOGOUT: `${API_BASE_URL}/Auth/logout`,
    CHANGE_PASSWORD: `${API_BASE_URL}/Auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/Auth/forgot-password`,
  },
  USER: {
    GET_ALL: `${API_BASE_URL}/User`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/User/${id}`,
    CREATE: `${API_BASE_URL}/User`,
    UPDATE: (id: number) => `${API_BASE_URL}/User/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/User/${id}`,
    CHANGE_PASSWORD: `${API_BASE_URL}/User/ChangePassWord`,
    // UPLOAD_PROFILE_PIC: `${API_BASE_URL}/User/upload-profile-pic`,
  },
  CUSTOMER: {
    GET_ALL: `${API_BASE_URL}/Customer`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Customer/${id}`,
    CREATE: `${API_BASE_URL}/Customer`,
    UPDATE: (id: number) => `${API_BASE_URL}/Customer/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Customer/${id}`,
  },
  AUDIT_LOG: {
    GET_BY_TABLE_AND_ID: (tableName: string, recordId: number) =>
      `${API_BASE_URL}/AuditLog/${tableName}/${recordId}`
  },
  ATTACHMENT: {
    GET_BY_TABLE_AND_ID: (tableName: string, recordId: number) =>
      `${API_BASE_URL}/Attachment/${tableName}/${recordId}`,
    GET_BY_ID: (attachmentId: number) => `${API_BASE_URL}/Attachment/${attachmentId}`,
    UPLOAD: `${API_BASE_URL}/Attachment/upload`,
    DELETE: (attachmentId: number) => `${API_BASE_URL}/Attachment/${attachmentId}`,
    GET: `${API_BASE_URL}/Attachment`,
    DOWNLOAD: (attachmentId: number) => `${API_BASE_URL}/Attachment/download/${attachmentId}`,
  },
  DAY_QUOTE: {
    GET_ALL: `${API_BASE_URL}/DayQuote`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DayQuote/${id}`,
    CREATE: `${API_BASE_URL}/DayQuote`,
    UPDATE: (id: number) => `${API_BASE_URL}/DayQuote/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DayQuote/${id}`,
  },
  MAIN_PAGE: {
    GET_ALL: `${API_BASE_URL}/MainPage`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/MainPage/${id}`,
    CREATE: `${API_BASE_URL}/MainPage`,
    UPDATE: (id: number) => `${API_BASE_URL}/MainPage/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/MainPage/${id}`,
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
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Branch/${id}`,
    CREATE: `${API_BASE_URL}/Branch`,
    UPDATE: (id: number) => `${API_BASE_URL}/Branch/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Branch/${id}`,
  },
  MANAGING_COMMITTEE: {
    GET_ALL: `${API_BASE_URL}/ManagingComitee`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/ManagingComitee/${id}`,
    CREATE: `${API_BASE_URL}/ManagingComitee`,
    UPDATE: (id: number) => `${API_BASE_URL}/ManagingComitee/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/ManagingComitee/${id}`,
  },
  STATE: {
    GET_ALL: `${API_BASE_URL}/State`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/State/${id}`,
    CREATE: `${API_BASE_URL}/State`,
    UPDATE: (id: number) => `${API_BASE_URL}/State/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/State/${id}`,
  },
  STATUS: {
    GET_ALL: `${API_BASE_URL}/Status`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Status/${id}`,
    CREATE: `${API_BASE_URL}/Status`,
    UPDATE: (id: number) => `${API_BASE_URL}/Status/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Status/${id}`,
  },
  CATEGORY: {
    GET_ALL: `${API_BASE_URL}/Category`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Category/${id}`,
    CREATE: `${API_BASE_URL}/Category`,
    UPDATE: (id: number) => `${API_BASE_URL}/Category/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Category/${id}`,
  },
  DESIGNATION: {
    GET_ALL: `${API_BASE_URL}/Designation`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Designation/${id}`,
    CREATE: `${API_BASE_URL}/Designation`,
    UPDATE: (id: number) => `${API_BASE_URL}/Designation/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Designation/${id}`,
  },
  USER_TYPE: {
    GET_ALL: `${API_BASE_URL}/UserType`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/UserType/${id}`,
    CREATE: `${API_BASE_URL}/UserType`,
    UPDATE: (id: number) => `${API_BASE_URL}/UserType/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/UserType/${id}`,
  },
  MEMBER: {
    GET_ALL: `${API_BASE_URL}/Member`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Member/${id}`,
    CREATE: `${API_BASE_URL}/Member`,
    UPDATE: (id: number) => `${API_BASE_URL}/Member/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Member/${id}`,
  },
  DEATH_CLAIMS: {
    GET_ALL: `${API_BASE_URL}/DeathClaim`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
    CREATE: `${API_BASE_URL}/DeathClaim`,
    UPDATE: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
  },
  MONTH: {
    GET_ALL: `${API_BASE_URL}/Month`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Month/${id}`,
    CREATE: `${API_BASE_URL}/Month`,
    UPDATE: (id: number) => `${API_BASE_URL}/Month/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Month/${id}`,
  },
  USER_ROLE_RIGHT: {
    GET_ALL: `${API_BASE_URL}/UserRoleRight`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/UserRoleRight/${id}`,
    CREATE: `${API_BASE_URL}/UserRoleRight`,
    UPDATE: (id: number) => `${API_BASE_URL}/UserRoleRight/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/UserRoleRight/${id}`,
  },
  REFUND_CONTRIBUTION: {
    GET_ALL: `${API_BASE_URL}/RefundContribution`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/RefundContribution/${id}`,
    CREATE: `${API_BASE_URL}/RefundContribution`,
    UPDATE: (id: number) => `${API_BASE_URL}/RefundContribution/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/RefundContribution/${id}`,
  },
  COMPANY: {
    GET_ALL: `${API_BASE_URL}/Company/GetAll/admin-getall-company`,
    GET: `${API_BASE_URL}/Company/GetCompanyLookUp/admin-lookUp-company`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Company/GetById/${id}`,
    CREATE: `${API_BASE_URL}/Company/Create`,
    UPDATE: (id: number) => `${API_BASE_URL}/Company/Update/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Company/Delete/${id}`,
  },
  CIRCLE_STATE: {
    GET_ALL: `${API_BASE_URL}/CircleState`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/CircleState/${id}`,
    CREATE: `${API_BASE_URL}/CircleState`,
    UPDATE: (id: number) => `${API_BASE_URL}/CircleState/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/CircleState/${id}`,
  },
  SUPPORT_TICKET: {
    GET_ALL: `${API_BASE_URL}/SupportTicket`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/SupportTicket/${id}`,
    CREATE: `${API_BASE_URL}/SupportTicket`,
    UPDATE: (id: number) => `${API_BASE_URL}/SupportTicket/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/SupportTicket/${id}`,
  },
  YEAR_MASTER: {
    GET_ALL: `${API_BASE_URL}/YearMaster`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/YearMaster/${id}`,
    CREATE: `${API_BASE_URL}/YearMaster`,
    UPDATE: (id: number) => `${API_BASE_URL}/YearMaster/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/YearMaster/${id}`,
  },
  DAILY_NEWS: {
    GET_ALL: `${API_BASE_URL}/DailyNews`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DailyNews/${id}`,
    CREATE: `${API_BASE_URL}/DailyNews`,
    UPDATE: (id: number) => `${API_BASE_URL}/DailyNews/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DailyNews/${id}`,
  },
  DIRECT_PAY: {
    GET_ALL: `${API_BASE_URL}/DirectPayment`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DirectPayment/${id}`,
    CREATE: `${API_BASE_URL}/DirectPayment`,
    UPDATE: (id: number) => `${API_BASE_URL}/DirectPayment/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DirectPayment/${id}`,
  },

  ACCOUNT_DIRECT_ENTRY: {
    GET_ALL: `${API_BASE_URL}/AccountDirecyEntry`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/AccountDirecyEntry/${id}`,
    CREATE: `${API_BASE_URL}/AccountDirecyEntry`,
    UPDATE: (id: number) => `${API_BASE_URL}/AccountDirecyEntry/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/AccountDirecyEntry/${id}`,
    GET_BY_STAFFID: (id: number) => `${API_BASE_URL}/AccountDirecyEntry/GetByMemberId${id}`,
  },
  //------------------------PUBLIC MODULE----------------------------------------
  PUBLIC: {
    GET_ALL_DAYQUOTE: `${API_BASE_URL}/Public/dayquotes`,
    GET_ALL_DAILYNEWS: `${API_BASE_URL}/Public/dailynews`,
    GET_ALL_MANAGINGCOMMITEE: `${API_BASE_URL}/Public/managingCommitee`,
    GET_ALL_PUBLICPAGE: `${API_BASE_URL}/Public/publicpage`,
    GET_ALL_ATTACHMENTS: `${API_BASE_URL}/Public/attachment`,
    GET_ATTACHMENTS_BY_ID: (id: number)=> `${API_BASE_URL}/Public/download/${id}`,
  },

  PUBLIC_PAGE: {
    GET_ALL: `${API_BASE_URL}/PublicPage/public/home`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/PublicPage/${id}`,
    CREATE: `${API_BASE_URL}/PublicPage`,
    UPDATE: (id: number) => `${API_BASE_URL}/PublicPage/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/PublicPage/${id}`
  },

  //-------------------------STAFF MODULE------------------------------

};

// ✅ Helper function to get full image URL
export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';

  // If already a complete URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Get base URL without /api suffix
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://sreenathganga-001-site12.jtempurl.com/api';
  const cleanBaseUrl = baseUrl.replace('/api', '');

  // Ensure proper path construction
  return `${cleanBaseUrl}/${imagePath.replace(/^\/+/, '')}`;
};

// ✅ Get base website URL (without /api)
export const getBaseWebsiteUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://sreenathganga-001-site12.jtempurl.com/api';
  return baseUrl.replace('/api', '');
};