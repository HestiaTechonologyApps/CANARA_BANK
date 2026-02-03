import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import KiduView from "../../../Components/KiduView";
import RefundContributionService from "../../../Services/Claims/Refund.services";

const RefundContributionView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "refundContributionId", label: "Refund Contribution ID", icon: "bi-hash" },
    { key: "staffNo", label: "Staff No", icon: "bi-123" },
    { key: "memberName", label: "Member", icon: "bi-person" },
    { key: "designationName", label: "Designation", icon: "bi-briefcase" },
    { key: "stateName", label: "State", icon: "bi-geo-alt" },
    { key: "deathDateString", label: "Death Date", icon: "bi-calendar-x" },
    { key: "refundNO", label: "Refund No", icon: "bi-receipt" },
    { key: "branchNameOFTime", label: "Branch (At Time)", icon: "bi-building" },
    { key: "dpcodeOfTime", label: "DP Code (At Time)", icon: "bi-upc" },
    { key: "type", label: "Type", icon: "bi-tags" },
    { key: "remark", label: "Remark", icon: "bi-chat-text" },
    { key: "ddno", label: "DD No", icon: "bi-credit-card" },
    { key: "dddateString", label: "DD Date", icon: "bi-calendar-event" },
    { key: "amount", label: "Amount", icon: "bi-currency-rupee" },
    { key: "lastContribution", label: "Last Contribution", icon: "bi-cash-stack" },
    { key: "yearName", label: "Year", icon: "bi-calendar" },
  ];

  const handleFetch = async (id: string) => {
    return await RefundContributionService.getRefundContributionById(
      Number(id)
    );
  };

  const handleDelete = async (id: string) => {
    await RefundContributionService.deleteRefundContribution(Number(id));
  };

  return (
    <KiduView
      title="Refund Contribution Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="refundContributionId"
      listRoute="/dashboard/claims/refundcontribution-list"
      editRoute="/dashboard/claims/refundcontribution-edit"
      auditLogConfig={{
        tableName: "RefundContribution",
        recordIdField: "refundContributionId",
      }}
      themeColor="#1B3763"
      loadingText="Loading Refund details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this refund? This action cannot be undone."
    />
  );
};

export default RefundContributionView;
