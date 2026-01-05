// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryList.tsx

import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";
//import type { AccountsDirectEntry } from "../../../Types/Accounts/AccountsDirectEntry.types";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

const columns = [
  { key: "accountsDirectEntryID", label: "ID", enableSorting: true, type: "text" as const },
  { key: "name", label: "Member", enableSorting: true, type: "text" as const },
  { key: "monthCode", label: "Month", enableSorting: true, type: "text" as const },
  { key: "yearOf", label: "Year", enableSorting: true, type: "text" as const },
  { key: "amt", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" as const },
];

const AccountDirectEntryList: React.FC = () => {
  const fetchData = async () => {
    const data = await AccountDirectEntryService.getAllAccountDirectEntries();
    return { data, total: data.length };
  };

  return (
    <KiduServerTable
      title="Account Direct Entries"
      subtitle="Manage entry with search and pagination"
      columns={columns}
      idKey="accountsDirectEntryID"
      addButtonLabel="Add Entry"
      fetchData={fetchData}
      addRoute="/dashboard/contributions/accountDirectEntry-create"
      editRoute="/dashboard/contributions/accountDirectEntry-edit"
      viewRoute="/dashboard/contributions/accountDirectEntry-view"
      showActions={true}
      showAddButton={true}
      showSearch={true}
      showExport={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default AccountDirectEntryList;
