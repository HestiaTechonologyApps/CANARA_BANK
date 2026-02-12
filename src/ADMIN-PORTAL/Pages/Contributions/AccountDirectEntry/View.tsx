import React from "react";
import KiduView from "../../../Components/KiduView";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

const AccountDirectEntryView: React.FC = () => {
  const fields = [
    { key: "accountsDirectEntryID", label: "Account Direct Entry ID" },
    { key: "memberName", label: "Member" },
    { key: "branchName", label: "Branch" },
    { key: "monthName", label: "Month" },
    { key: "yearName", label: "Year" },
    { key: "ddIba", label: "DD / IBA" },
    { key: "ddIbaDateString", label: "DD / IBA Date" },
    { key: "amt", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "enrl", label: "ENRL", icon: "bi-file-text" },
    { key: "fine", label: "Fine", icon: "bi-exclamation-circle" },
    { key: "f9", label: "F9", icon: "bi-list-check" },
    { key: "f10", label: "F10", icon: "bi-list-check" },
    { key: "f11", label: "F11", icon: "bi-list-check" },
    { key: "approvedBy", label: "Approved By", icon: "bi-person-check" },
    { key: "approvedDateString", label: "Approved Date", icon: "bi-calendar-check" },
    { key: "isApproved", label: "Approved", isBoolean: true },
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
      themeColor="#1B3763"
      loadingText="Loading account direct entry details..."
      showDeleteButton
      showEditButton
      deleteConfirmMessage="Are you sure you want to delete this entry? This action cannot be undone."
      auditLogConfig={{ tableName: "ACCOUNT_DIRECT_ENTRY", recordIdField: "accountsDirectEntryID" }}
    />
  );
};

export default AccountDirectEntryView;
