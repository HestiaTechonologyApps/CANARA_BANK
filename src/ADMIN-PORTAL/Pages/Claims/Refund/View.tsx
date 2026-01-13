// src/ADMIN-PORTAL/Pages/Contributions/RefundContribution/RefundContributionView.tsx
import React from "react";
import KiduView from "../../../Components/KiduView";
import type { ViewField } from "../../../Components/KiduView";
import RefundContributionService from "../../../Services/Claims/Refund.services";

const RefundContributionView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "refundContributionId", label: "Refund Contribution ID" },
    { key: "staffNo", label: "Staff No" },
    { key: "stateId", label: "State ID" },
    { key: "designationId", label: "Designation ID" },
    { key: "refundNO", label: "Refund No" },
    { key: "branchNameOFTime", label: "Branch Name (At the Time)" },
    { key: "dpcodeOfTime", label: "DP Code (At the Time)" },
    { key: "type", label: "Type" },
    { key: "remark", label: "Remark" },
    { key: "ddno", label: "DD No" },
    { key: "dddateString", label: "DD Date", isDate: true },
    { key: "amount", label: "Amount" },
    { key: "lastContribution", label: "Last Contribution" },
    { key: "yearOF", label: "Year Of" },
  ];

  const handleFetch = async (id: string) => {
    const response = await RefundContributionService.getRefundContributionById(Number(id));
    return response;
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
      editRoute="/dashboard/claims/refundcontribution-edit"
      listRoute="/dashboard/claims/refundcontribution-list"
      auditLogConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
      themeColor="#1B3763"
    />
  );
};

export default RefundContributionView;
