export interface UserRegistrationListItem {
  userRegistrationId: number;
  userName: string;
  userEmail: string;
  staffNo: number;
  phoneNumber: string;
  registrationStatus: string;
  requestedDate: string;
}

export interface UserRegistrationDetail extends UserRegistrationListItem {
  memberId?: number;
  address: string;
  role: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectReason?: string;
}