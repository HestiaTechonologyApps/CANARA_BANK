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
    GET_ALL: `${API_BASE_URL}/api/Status`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/Status/${id}`,
    CREATE: `${API_BASE_URL}/api/Status`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/Status/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/Status/${id}`,
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
   MEMBER:{
   GET_ALL: `${API_BASE_URL}/Member`,
   GET_BY_ID: (id: number) => `${API_BASE_URL}/Member/${id}`,
   CREATE: `${API_BASE_URL}/Member`,
   UPDATE: (id: number) => `${API_BASE_URL}/Member/${id}`,
   DELETE: (id: number) => `${API_BASE_URL}/Member/${id}`,
  },
  DEATH_CLAIMS:{
   GET_ALL: `${API_BASE_URL}/DeathClaim`,
   GET_BY_ID: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
   CREATE: `${API_BASE_URL}/DeathClaim`,
   UPDATE: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
   DELETE: (id: number) => `${API_BASE_URL}/DeathClaim/${id}`,
  },
  
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