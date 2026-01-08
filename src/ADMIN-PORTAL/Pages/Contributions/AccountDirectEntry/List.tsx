// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryList.tsx

import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";

import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";
import MonthService from "../../../Services/Settings/Month.services";
import type { Month } from "../../../Types/Settings/Month.types";

const columns = [
  { key: "accountsDirectEntryID", label: "ID", enableSorting: true, type: "text" as const },
  { key: "name", label: "Member", enableSorting: true, type: "text" as const },
  { key: "branchName", label: "Branch", enableSorting: true, type: "text" as const },
  { key: "monthName", label: "Month", enableSorting: true, type: "text" as const }, 
  { key: "yearOf", label: "Year", enableSorting: true, type: "text" as const },
  { key: "amt", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" as const },
];

const AccountDirectEntryList: React.FC = () => {
  const fetchData = async () => {
    // 1️⃣ Fetch entries
    const entries = await AccountDirectEntryService.getAllAccountDirectEntries();

    // 2️⃣ Fetch months
    const months = await MonthService.getAllMonths();

    // 3️⃣ Build lookup map
    const monthMap = Object.fromEntries(
      months.map((m: Month) => [m.monthCode, m.monthName])
    );

    // 4️⃣ Enrich data
    const enrichedData = entries.map((e: any) => ({
      ...e,
      monthName: monthMap[e.monthCode] ?? e.monthCode,
      branchName: e.branchName ?? e.name, // adjust if you later add branch lookup
    }));

    return {
      data: enrichedData,
      total: enrichedData.length,
    };
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
      showActions
      showAddButton
      showSearch
      showExport
      showTitle
      rowsPerPage={10}
    />
  );
};

export default AccountDirectEntryList;
