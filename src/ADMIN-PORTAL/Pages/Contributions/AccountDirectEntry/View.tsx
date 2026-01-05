// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryView.tsx
import React from "react";
import KiduView from "../../../Components/KiduView";
import type { ViewField } from "../../../Components/KiduView";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

const fields: ViewField[] = [
  { key: "accountsDirectEntryID", label: "Entry ID", icon: "bi-hash" },
  { key: "name", label: "Member Name", icon: "bi-person" },
  { key: "monthCode", label: "Month", icon: "bi-calendar" },
  { key: "yearOf", label: "Year", icon: "bi-calendar2" },
  { key: "amt", label: "Amount", icon: "bi-cash" },
  { key: "status", label: "Status", icon: "bi-activity" },
  { key: "isApproved", label: "Approved", icon: "bi-check2-circle", isBoolean: true },
];

const AccountDirectEntryView: React.FC = () => {
  const handleFetch = async (id: string) =>
    AccountDirectEntryService.getAccountDirectEntryById(Number(id));

  const handleDelete = async (id: string) =>
    AccountDirectEntryService.deleteAccountDirectEntry(Number(id));

  return (
    <KiduView
      title="Account Direct Entry Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="accountsDirectEntryID"
      editRoute="/dashboard/contributions/accountDirectEntry-edit"
      listRoute="/dashboard/contributions/accountDirectEntry-list"
      auditLogConfig={{ tableName: "AccountDirectEntry", recordIdField: "accountsDirectEntryID" }}
      themeColor="#18575A"
      loadingText="Loading entry details..."
      showDeleteButton={true}
      showEditButton={true}
      deleteConfirmMessage="Are you sure you want to delete this entry? This action cannot be undone."
    />
  );
};

export default AccountDirectEntryView;
