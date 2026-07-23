import React from "react";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const RefundContributionList: React.FC = () => {
  return (
    <KiduServerTableList
      paginatedFetchService={async (params) => {
        return RefundContributionService.getPagedRefundContributions({
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          searchTerm: params.searchTerm,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        });
      }}
        transformData={(data) => {
        console.log("DEBUG - first row:", data[0]);
        return data.map((item: any) => ({
          ...item,
          _disableEdit: item.isApproved === true,
        }));
      }}

      columns={[
        { key: "refundContributionId", label: "Refund ID", enableSorting: true, type: "text" },
        { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" },
        { key: "memberName", label: "Member", enableSorting: true, type: "text" },
        { key: "designationName", label: "Designation", enableSorting: true, type: "text" },
        { key: "stateName", label: "State", enableSorting: true, type: "text" },
        { key: "refundNO", label: "Refund No", enableSorting: true, type: "text" },
        { key: "amount", label: "Amount", enableSorting: true, type: "text" },
        { key: "yearName", label: "Year", enableSorting: true, type: "text" },
        { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" },
      ]}

      filterColumns={[
              { key: "refundContributionId", label: "Refund ID", type: "text" },
        { key: "staffNo", label: "Staff No", type: "text" },
        { key: "memberName", label: "Member", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "refundNO", label: "Refund No", type: "text" },
        { key: "amount", label: "Amount", type: "text" },
        { key: "yearName", label: "Year", type: "text" }, 
        { key: "isApproved", label: "Approved", type: "text" },
      ]}
      
      idKey="refundContributionId"
      title="Refund Contribution Management"
      subtitle="Manage refund contributions with search, filter, and pagination."
      addButtonLabel="Add New"
      addRoute="/dashboard/claims/refundcontribution-create"
      editRoute="/dashboard/claims/refundcontribution-edit"
      viewRoute="/dashboard/claims/refundcontribution-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default RefundContributionList;
