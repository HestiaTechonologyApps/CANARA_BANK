// src/Pages/Accounts/AccountsDirectEntry/View.tsx
import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import KiduView from "../../../Components/KiduView";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

const AccountDirectEntryView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "accountsDirectEntryID", label: "Entry ID", icon: "bi-hash" },
    { key: "memberName", label: "Member", icon: "bi-person" },
    { key: "branchName", label: "Branch", icon: "bi-building" },
    { key: "monthName", label: "Month", icon: "bi-calendar-month" },
    { key: "yearOf", label: "Year", icon: "bi-calendar" },
    { key: "amt", label: "Amount", icon: "bi-currency-rupee" },
    { key: "ddIba", label: "DD / IBA", icon: "bi-credit-card" },
    { key: "ddIbaDate", label: "DD / IBA Date", icon: "bi-calendar-event" },
    { key: "enrl", label: "ENRL", icon: "bi-file-text" },
    { key: "fine", label: "Fine", icon: "bi-exclamation-circle" },
    { key: "status", label: "Status", icon: "bi-activity" },
    { key: "isApproved", label: "Approved", icon: "bi-check-circle", isBoolean: true },
    { key: "approvedBy", label: "Approved By", icon: "bi-person-check" },
    { key: "approvedDate", label: "Approved Date", icon: "bi-calendar-check" },
  ];

  const handleFetch = async (id: string) => {
    const response =
      await AccountDirectEntryService.getAccountDirectEntryById(Number(id));

    const entry = response.value;

    if (!entry) return response;

    return {
      ...response,
      value: {
        ...entry,
        ddIbaDate: entry.ddIbaDateString
          ? entry.ddIbaDateString.split("T")[0]
          : entry.ddIbaDate,

        approvedDate: entry.approvedDateString
          ? entry.approvedDateString.split("T")[0]
          : entry.approvedDate,
      },
    };
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
      auditLogConfig={{
        tableName: "AccountDirectEntry",
        recordIdField: "accountsDirectEntryID",
      }}
      themeColor="#1B3763"
      loadingText="Loading account direct entry details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this account direct entry? This action cannot be undone."
    />
  );
};

export default AccountDirectEntryView;
