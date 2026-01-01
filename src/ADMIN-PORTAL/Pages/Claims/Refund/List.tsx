// src/ADMIN-PORTAL/Pages/Contributions/RefundContribution/RefundContributionList.tsx

import React from "react";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import KiduServerTable from "../../../../Components/KiduServerTable";
import type { RefundContribution } from "../../../Types/Claims/Refund.types";


const columns = [
  { key: "refundContributionId", label: "Refund ID", enableSorting: true, type: "text" as const, },
  { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" as const, },
  { key: "refundNO", label: "Refund No", enableSorting: true, type: "text" as const, },
  { key: "branchNameOFTime", label: "Branch Name", enableSorting: true, type: "text" as const, },
  { key: "dpcodeOfTime", label: "DP Code", enableSorting: true, type: "text" as const, },
  { key: "type",label: "Type", enableSorting: true, type: "text" as const, },
  { key: "amount", label: "Amount", enableSorting: true, type: "text" as const, },
  { key: "yearOF", label: "Year Of", enableSorting: true, type: "text" as const, },
];

const RefundContributionList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: RefundContribution[]; total: number }> => {
    try {
      const refundContributions =
        await RefundContributionService.getAllRefundContributions();

      let filteredData = refundContributions;

if (params.searchTerm) {
  const searchLower = params.searchTerm.toLowerCase();

  filteredData = refundContributions.filter((item) =>
    item.refundContributionId?.toString().includes(params.searchTerm) ||
    item.branchNameOFTime?.toLowerCase().includes(searchLower) ||
    item.dpcodeOfTime?.toLowerCase().includes(searchLower) ||
    item.type?.toLowerCase().includes(searchLower) ||
    item.amount?.toString().includes(params.searchTerm) ||
    item.yearOF?.toString().includes(params.searchTerm)
  );
}
      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: filteredData.length,
      };
    } catch (error: any) {
      console.error("Error fetching refund contributions:", error);
      throw new Error(
        error.message || "Failed to fetch refund contributions"
      );
    }
  };

  return (
    <KiduServerTable
      title="Refund Contribution Management"
      subtitle="Manage refund contributions with search, filter, and pagination"
      columns={columns}
      idKey="refundContributionId"
      addButtonLabel="Add Refund"
      addRoute="/dashboard/claims/refundcontribution-create"
      editRoute="/dashboard/claims/refundcontribution-edit"
      viewRoute="/dashboard/claims/refundcontribution-view"
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

export default RefundContributionList;
