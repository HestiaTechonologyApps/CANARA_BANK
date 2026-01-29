// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryList.tsx
import React from "react";
import KiduServerTable from "../../../Components/KiduServerTable";
import AccountDirectEntryService from "../../../ADMIN-PORTAL/Services/Contributions/AccountDirectEntry.services";

const columns = [
  { key: "accountsDirectEntryID", label: "ID", enableSorting: true, type: "text" as const },
  { key: "memberName", label: "Member", enableSorting: true, type: "text" as const },
  { key: "branchName", label: "Branch", enableSorting: true, type: "text" as const },
  { key: "monthName", label: "Month", enableSorting: true, type: "text" as const },
  { key: "yearName", label: "Year", enableSorting: true, type: "text" as const },
  { key: "amt", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "status", label: "Status", enableSorting: true, type: "text" as const },
  { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" as const },
];

const StaffAccountDirectEntryList: React.FC = () => {

  const fetchData = async ({ pageNumber, pageSize, searchTerm }: any) => {
    //  Get logged-in memberId from localStorage
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const staffId = parsedUser?.memberId;
    if (!staffId) {
      return { data: [], total: 0 };
    }
    //  Fetch entries by staffId
    const response = await AccountDirectEntryService.getAccountDirectEntryByStaffId(staffId);
    const entries = response.value ?? [];
    //  Normalize / fallback fields
    let enrichedData = entries.map((e: any) => ({
      ...e,
      monthName: e.monthName ?? e.monthCode,
      branchName: e.branchName ?? "-",
    }));
    //  SEARCH (same pattern as BranchList)
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      enrichedData = enrichedData.filter((e: any) =>
        e.name?.toLowerCase().includes(q) ||
        e.branchName?.toLowerCase().includes(q) ||
        e.monthName?.toLowerCase().includes(q) ||
        String(e.yearOf).includes(q) ||
        String(e.amt).includes(q)
      );
    }
    //  PAGINATION
    const start = (pageNumber - 1) * pageSize;
    const pagedData = enrichedData.slice(start, start + pageSize);
    return {
      data: pagedData,
      total: enrichedData.length,
    };
  };

  return (
    <KiduServerTable
      title="Account Direct Entry"
      subtitle="Manage entry with search and pagination"
      columns={columns}
      idKey="accountsDirectEntryID"
      addButtonLabel="Add Entry"
      fetchData={fetchData}
      addRoute="/staff-portal/contributions/staffaccountDirectEntry-create"
      editRoute="/staff-portal/contributions/staffaccountDirectEntry-edit"
      viewRoute="/staff-portal/contributions/staffaccountDirectEntry-view"
      showActions
      showAddButton
      showSearch
      showExport
      showTitle
      rowsPerPage={10}
    />
  );
};

export default StaffAccountDirectEntryList;
