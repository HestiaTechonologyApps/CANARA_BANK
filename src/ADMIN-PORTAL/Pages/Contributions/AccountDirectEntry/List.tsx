import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";
import type { AccountDirectEntry } from "../../../Types/Contributions/AccountDirectEntry.types";

const columns = [
  { key: "accountsDirectEntryID", label: "Account Direct Entry ID", enableSorting: true, type: "text" as const },
  { key: "memberName", label: "Member", enableSorting: true, type: "text" as const },
  { key: "branchName", label: "Branch", enableSorting: true, type: "text" as const },
  { key: "monthName", label: "Month", enableSorting: true, type: "text" as const },
  { key: "yearName", label: "Year", enableSorting: true, type: "text" as const },
  { key: "amt", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "status", label: "Status", enableSorting: true, type: "text" as const },
  { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" as const },
];

const AccountsDirectEntryList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: AccountDirectEntry[]; total: number }> => {

    let entries = await AccountDirectEntryService.getAllAccountDirectEntries();

    // 🔎 Search (type-safe)
    if (params.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      entries = entries.filter(e =>
        [
          e.accountsDirectEntryID?.toString(),
          e.memberName,
          e.branchName,
          e.monthName,
          e.status,
          e.yearName?.toString(),
          e.yearOf?.toString(),
        ]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q))
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: entries.slice(start, end),
      total: entries.length,
    };
  };

  return (
    <KiduServerTable
      title="Accounts Direct Entry"
      subtitle="Manage account direct entries with search, filter, and pagination."
      columns={columns}
      idKey="accountsDirectEntryID"
      addButtonLabel="Add Entry"
      addRoute="/dashboard/contributions/accountDirectEntry-create"
      editRoute="/dashboard/contributions/accountDirectEntry-edit"
      viewRoute="/dashboard/contributions/accountDirectEntry-view"
      showAddButton
      showExport
      showSearch
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default AccountsDirectEntryList;
