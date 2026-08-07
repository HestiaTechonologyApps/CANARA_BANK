import React from "react";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import RefundContributionService from "../../../ADMIN-PORTAL/Services/Claims/Refund.services";
import type { RefundContribution } from "../../../ADMIN-PORTAL/Types/Claims/Refund.types";
import AuthService from "../../../Services/Auth.services";

const RefundContributionByMemberList: React.FC = () => {
  const memberId = AuthService.getMemberId();

  return (
    <KiduServerTableList
    fetchService={async () => {
        if (!memberId) return [];

        const response = await RefundContributionService.getRefundContributionByMemberId(
          Number(memberId)
        );

        console.log("DEBUG - raw response.value:", response.value);

        const rawValue = response.value;
        const refunds: RefundContribution[] = Array.isArray(rawValue)
          ? rawValue
          : rawValue
          ? [rawValue as unknown as RefundContribution]
          : [];

        return refunds.map(r => ({
          ...r,
          deathDateString: r.deathDate
            ? new Date(r.deathDate).toLocaleDateString("en-IN")
            : "",
          dddateString: r.dddate
            ? new Date(r.dddate).toLocaleDateString("en-IN")
            : "",
          status: !r.approvedDate
            ? "Approval Pending"
            : r.isApproved
            ? "Approved"
            : "Rejected",
        }));
      }}

      columns={[
        { key: "refundContributionId", label: "Refund ID", enableSorting: true, type: "text" },
        { key: "memberName", label: "Member", enableSorting: true, type: "text" },
        { key: "stateName", label: "State", enableSorting: true, type: "text" },
        { key: "designationName", label: "Designation", enableSorting: true, type: "text" },
       // { key: "deathDateString", label: "Death Date", enableSorting: true, type: "text" },
        { key: "refundNO", label: "Refund No", enableSorting: true, type: "text" },
        { key: "type", label: "Type", enableSorting: true, type: "text" },
        { key: "ddno", label: "DD No", enableSorting: true, type: "text" },
        { key: "dddateString", label: "DD Date", enableSorting: true, type: "text" },
        { key: "amount", label: "Amount", enableSorting: true, type: "text" },
        { key: "yearName", label: "Year", enableSorting: true, type: "text" },
        { key: "status", label: "Status", enableSorting: true, type: "text" },
      ]}

      filterColumns={[
        { key: "refundContributionId", label: "Refund ID", type: "text" },
        { key: "memberName", label: "Member", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "refundNO", label: "Refund No", type: "text" },
        { key: "type", label: "Type", type: "text" },
        { key: "ddno", label: "DD No", type: "text" },
        { key: "amount", label: "Amount", type: "text" },
        { key: "yearName", label: "Year", type: "text" },
        { key: "status", label: "Status", type: "text" },
      ]}

      idKey="refundContributionId"
      title="Refund Contributions"
      subtitle="Your refund contribution history."
      addButtonLabel="Add New"
      addRoute="/staff-portal/refund-list/MemberRefundContribution-create"
      editRoute="/staff-portal/refund-list/MemberRefundContribution-edit"
      viewRoute="/staff-portal/refund-list/MemberRefundContribution-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
      disableEditWhen={(row) => row.isApproved === true}
      disabledEditTooltip="This refund has already been approved and cannot be edited"
    />
  );
};

export default RefundContributionByMemberList;