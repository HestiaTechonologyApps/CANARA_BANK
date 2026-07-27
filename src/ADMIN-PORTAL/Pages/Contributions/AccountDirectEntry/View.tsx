import React from "react";
import KiduView from "../../../Components/KiduView";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";
import UserService from "../../../Services/Settings/User.services";

const THEME_COLOR = "#1B3763";

const AccountDirectEntryView: React.FC = () => {
  const fields = [
    { key: "accountsDirectEntryID", label: "Account Direct Entry ID", icon: "bi-hash" },
    { key: "memberName", label: "Member", icon: "bi-person" },
    { key: "branchName", label: "Branch", icon: "bi-building" },
    { key: "monthName", label: "Month", icon: "bi-calendar-month" },
    { key: "yearName", label: "Year", icon: "bi-calendar3" },
    { key: "ddIba", label: "DD / IBA", icon: "bi-receipt" },
    { key: "ddIbaDateString", label: "DD / IBA Date", icon: "bi-calendar-event" },
    { key: "amt", label: "Amount", icon: "bi-currency-rupee" },
    { key: "status", label: "Status", icon: "bi-info-circle" },
    { key: "enrl", label: "ENRL", icon: "bi-file-text" },
    { key: "fine", label: "Fine", icon: "bi-exclamation-circle" },
    { key: "f9", label: "F9", icon: "bi-list-check" },
    { key: "f10", label: "F10", icon: "bi-list-check" },
    { key: "f11", label: "F11", icon: "bi-list-check" },
    { key: "approvedByName", label: "Approved By", icon: "bi-person-check" }, // ✅ changed key
    { key: "approvedDateString", label: "Approved Date", icon: "bi-calendar-check" },
    { key: "isApproved", label: "Approved", icon: "bi-patch-check", isBoolean: true },
  ];

  const formatDateOnly = (value?: string | Date | null) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-IN");
  };

  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    if (response.value) {
      response.value.ddIbaDateString = formatDateOnly(response.value.ddIbaDateString);
      response.value.approvedDateString = formatDateOnly(response.value.approvedDateString);

      // ✅ Fetch approvedBy username from user ID
      if (response.value.approvedBy) {
        try {
          const userResponse = await UserService.getUserById(Number(response.value.approvedBy));
          (response.value as any).approvedByName = userResponse.value?.userName || response.value.approvedBy;
        } catch {
          (response.value as any).approvedByName = response.value.approvedBy;
        }
      } else {
        (response.value as any).approvedByName = "";
      }
    }
    return response;
  };

  const handleDelete = async (id: string) => {
    await AccountDirectEntryService.deleteAccountDirectEntry(Number(id));
  };

  return (
    <KiduView
      title="Account Direct Entry Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="accountsDirectEntryID"
      listRoute="/dashboard/contributions/accountDirectEntry-list"
      editRoute="/dashboard/contributions/accountDirectEntry-edit"
      themeColor={THEME_COLOR}
      loadingText="Loading account direct entry details..."
      showDeleteButton
      showEditButton
      deleteConfirmMessage="Are you sure you want to delete this entry? This action cannot be undone."
      auditLogConfig={{ tableName: "ACCOUNT_DIRECT_ENTRY", recordIdField: "accountsDirectEntryID" }}
      attachmentConfig={{ tableName: "AccountDirectEntry", recordIdField: "accountsDirectEntryID" }}
      disableEditWhen={(data) => data.isApproved === true || data.status === "Approved"}
       disableDeleteWhen={(data) => data.isApproved === true || data.status === "Approved"}
    />
  );
};

export default AccountDirectEntryView;