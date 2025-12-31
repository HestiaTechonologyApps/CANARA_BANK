import type { AuditTrails } from "../../../Types/AuditLog.types";

export interface Member {
  memberId: number;
  staffNo: number;
  designationId: number;
  categoryId: number;
  branchId: number;
  name: string;
  genderId: number;
  //imageId: number;
  dob: Date | string; 
  dobString: string;
  doj: Date | string; 
  dojString: string;
  dojtoScheme: Date | string; 
  dojtoSchemeString: string;
  statusId: number;
  isRegCompleted: boolean;
  createdByUserId: number;
  createdDate: Date | string;
  createdDateString: Date | string;
  modifiedByUserId: number;
  modifiedDate: Date | string;
  modifiedDateString: string;
  nominee: string;
  profileImageSrc: string;
  nomineeRelation: string;
  nomineeIDentity: string;
  unionMember: string;
  totalRefund: string;
  auditLogs?: AuditTrails[];
}
