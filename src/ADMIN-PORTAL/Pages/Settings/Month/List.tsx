// src/ADMIN-PORTAL/Pages/Settings/Month/MonthList.tsx
import React from "react";
import MonthService from "../../../Services/Settings/Month.services";
import KiduServerTable from "../../../../Components/KiduServerTable";

const columns = [
  { key: "monthCode", label: "Month Code", enableSorting: true, type: "text" as const },
  { key: "monthName", label: "Month Name", enableSorting: true, type: "text" as const },
  { key: "abbrivation", label: "Abbreviation", enableSorting: true, type: "text" as const },
];

const MonthList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {
    const months = await MonthService.getAllMonths();
    let filtered = months;
    if (params.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      filtered = months.filter(
        (m) =>
          String(m.monthCode).toLowerCase().includes(q) ||
          (m.monthName ?? "").toLowerCase().includes(q) ||
          (m.abbrivation ?? "").toLowerCase().includes(q)
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;
    const paginated = filtered.slice(start, end);

    return { data: paginated, total: filtered.length };
  };

  return (
    <KiduServerTable
      title="Month List"
      subtitle="Manage months with search, sort, and pagination"
      columns={columns}
      idKey="monthCode"
      addButtonLabel="Add Month"
      addRoute="/dashboard/settings/month-create"
      editRoute="/dashboard/settings/month-edit"
      viewRoute="/dashboard/settings/month-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default MonthList;
