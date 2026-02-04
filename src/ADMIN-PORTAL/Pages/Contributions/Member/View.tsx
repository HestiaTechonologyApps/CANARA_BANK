import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import MemberService from "../../../Services/Contributions/Member.services";
import KiduView from "../../../Components/KiduView";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../../Assets/Images/profile.jpg";

const MemberView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "memberId", label: "Member ID", icon: "bi-hash" },
    { key: "staffNo", label: "Staff No", icon: "bi-123" },
    { key: "name", label: "Name", icon: "bi-person" },
    { key: "gender", label: "Gender", icon: "bi-gender-ambiguous" },
    { key: "designationName", label: "Designation", icon: "bi-briefcase" },
    { key: "categoryname", label: "Category", icon: "bi-ui-checks-grid" },
    { key: "branchName", label: "Branch", icon: "bi-building" },
    { key: "dpCode", label: "DP Code", icon: "bi-code-square" },
    { key: "status", label: "Status", icon: "bi-activity" },
    { key: "dobString", label: "Date of Birth", icon: "bi-calendar" },
    { key: "dojString", label: "Date of Joining", icon: "bi-calendar-check" },
    { key: "dojtoSchemeString", label: "DOJ to Scheme", icon: "bi-calendar-event" },
    { key: "isRegCompleted", label: "Registration Completed", icon: "bi-clipboard-check", isBoolean: true },
    { key: "nominee", label: "Nominee", icon: "bi-person-heart" },
    { key: "nomineeRelation", label: "Nominee Relation", icon: "bi-people" },
    { key: "nomineeIDentity", label: "Nominee Identity", icon: "bi-person-badge" },
    { key: "unionMember", label: "Union Member", icon: "bi-patch-check" },
    { key: "totalRefund", label: "Total Refund", icon: "bi-cash" }
  ];
const formatDateOnly = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN");
};

const handleFetch = async (memberId: string) => {
  const response = await MemberService.getMemberById(Number(memberId));

  if (response.value) {
    // Profile image
    response.value.profileImageSrc = response.value.profileImageSrc
      ? getFullImageUrl(response.value.profileImageSrc)
      : defaultProfileImage;

    // ✅ Date-only formatting
    response.value.dobString = formatDateOnly(response.value.dobString);
    response.value.dojString = formatDateOnly(response.value.dojString);
    response.value.dojtoSchemeString = formatDateOnly(response.value.dojtoSchemeString);
  }

  return response;
};

  const handleDelete = async (memberId: string) => {
    await MemberService.deleteMember(Number(memberId));
  };

  return (
    <KiduView
      title="Member Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/contributions/member-edit"
      listRoute="/dashboard/contributions/member-list"
      paramName="memberId"
      imageConfig={{
        fieldName: "profileImageSrc",
        defaultImage: defaultProfileImage,
        showNameField: "name",
        showIdField: "staffNo",
        isCircle: true
      }}
      auditLogConfig={{ tableName: "Member", recordIdField: "memberId" }}
      themeColor="#1B3763"
      loadingText="Loading member details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this member? This action cannot be undone."
    />
  );
};

export default MemberView;
