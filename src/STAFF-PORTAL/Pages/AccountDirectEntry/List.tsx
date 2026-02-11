import React from "react";
import KiduServerTableList from "../../../Components/KiduServerTableList";
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

  const fetchService = async () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const staffId = parsedUser?.memberId;
    
    if (!staffId) {
      return [];
    }
    const response = await AccountDirectEntryService.getAccountDirectEntryByStaffId(staffId);
    return response.value ?? [];
  };

  const transformData = (entries: any[]) => {
    return entries.map((e: any) => ({
      ...e,
      monthName: e.monthName ?? e.monthCode,
      branchName: e.branchName ?? "-",
    }));
  };

  return (
    <KiduServerTableList
      title="Account Direct Entry"
      subtitle="Manage entry with search and pagination"
      columns={columns}
      idKey="accountsDirectEntryID"
      addButtonLabel="Add Entry"
      fetchService={fetchService}
      transformData={transformData}
      addRoute="/staff-portal/contributions/staffaccountDirectEntry-create"
      editRoute="/staff-portal/contributions/staffaccountDirectEntry-edit"
      viewRoute="/staff-portal/contributions/staffaccountDirectEntry-view"
      showActions
      showAddButton
      showSearch
      showExport
      rowsPerPage={10}
    />
  );
};

export default StaffAccountDirectEntryList;