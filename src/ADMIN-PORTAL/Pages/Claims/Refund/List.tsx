import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";
import type { RefundContribution } from "../../../Types/Claims/Refund.types";
import RefundContributionService from "../../../Services/Claims/Refund.services";

const columns = [
  { key: "refundContributionId", label: "Refund ID", enableSorting: true, type: "text" as const },
  { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" as const },
  { key: "memberName", label: "Member", enableSorting: true, type: "text" as const },
  { key: "designationName", label: "Designation", enableSorting: true, type: "text" as const },
  { key: "stateName", label: "State", enableSorting: true, type: "text" as const },
  { key: "refundNO", label: "Refund No", enableSorting: true, type: "text" as const },
  { key: "amount", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "yearOF", label: "Year", enableSorting: true, type: "text" as const },
];

const RefundContributionList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {

    let data: RefundContribution[] =
      await RefundContributionService.getAllRefundContributions();

    if (params.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      data = data.filter(r =>
        [
          r.refundContributionId?.toString(),
          r.staffNo?.toString(),
          r.memberName,
          r.designationName,
          r.stateName,
          r.refundNO?.toString(),
        ]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q))
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
      title="Refund Contribution Management"
      subtitle="Manage refund contributions with search, filter, and pagination."
      columns={columns}
      idKey="refundContributionId"
      addButtonLabel="Add Refund"
      addRoute="/dashboard/claims/refundcontribution-create"
      editRoute="/dashboard/claims/refundcontribution-edit"
      viewRoute="/dashboard/claims/refundcontribution-view"
      fetchData={fetchData}
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default RefundContributionList;
