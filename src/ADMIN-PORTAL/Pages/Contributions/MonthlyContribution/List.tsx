import React from "react";
import type { MonthlyContribution } from "../../../Types/Contributions/MonthlyContribution.types";
import MonthlyContributionService from "../../../Services/Contributions/MonthlyContribution.services";
import KiduServerTable from "../../../../Components/KiduServerTable";

const columns = [
  { key: "monthlyContributionId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "fileName", label: "File Name", enableSorting: true, type: "text" as const },
  { key: "fileType", label: "File Type", enableSorting: true, type: "text" as const },
  { key: "fileExtension", label: "Extension", enableSorting: true, type: "text" as const },
  { key: "monthName", label: "Month Code", enableSorting: true, type: "text" as const },
  { key: "yearName", label: "Year", enableSorting: true, type: "text" as const },
];

const MonthlyContributionList: React.FC = () => {

  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {

    let data = await MonthlyContributionService.getAllMonthlyContributions();

    if (params.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      data = data.filter((m: MonthlyContribution) =>
        [m.fileName, m.fileType, m.fileExtension]
          .filter(Boolean)
          .some(v => (v ?? '').toString().toLowerCase().includes(q))
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: data.slice(start, end),
      total: data.length,
    };
  };

  return (
    <KiduServerTable
      title="Monthly Contribution Management"
      columns={columns}
      idKey="monthlyContributionId"
      addButtonLabel="Add Monthly Contribution"
      addRoute="/dashboard/contributions/monthlyContribution-create"
      editRoute="/dashboard/contributions/monthlyContribution-edit"
      viewRoute="/dashboard/contributions/monthlyContribution-view"
      fetchData={fetchData}
      showAddButton
      showSearch
      showActions
      showTitle
      rowsPerPage={10}
    />
  );
};

export default MonthlyContributionList;
