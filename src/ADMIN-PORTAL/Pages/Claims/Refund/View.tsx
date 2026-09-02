import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import KiduView from "../../../Components/KiduView";
import RefundContributionService from "../../../Services/Claims/Refund.services";

const RefundContributionView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "refundContributionId", label: "Refund Contribution ID", icon: "bi-hash" },
    { key: "refundNO", label: "Refund No", icon: "bi-receipt" },
    { key: "staffNo", label: "Staff No", icon: "bi-123" },
    { key: "memberName", label: "Member", icon: "bi-person" },
    { key: "designationName", label: "Designation", icon: "bi-briefcase" },
    { key: "stateName", label: "State", icon: "bi-geo-alt" },
    { key: "deathDateString", label: "Death Date", icon: "bi-calendar-x" },
    { key: "branchNameOFTime", label: "Branch (At Time)", icon: "bi-building" },
    { key: "dpcodeOfTime", label: "DP Code (At Time)", icon: "bi-upc" },
    { key: "type", label: "Type", icon: "bi-tags" },
    { key: "remark", label: "Remark", icon: "bi-chat-text" },
    { key: "ddno", label: "DD No", icon: "bi-credit-card" },
    { key: "dddateString", label: "DD Date", icon: "bi-calendar-event" },
    { key: "amount", label: "Amount", icon: "bi-currency-rupee" },
    { key: "lastContribution", label: "Last Contribution", icon: "bi-cash-stack" },
    { key: "approvedAmount", label: "Total Approved Refund Amount", icon: "bi-check-circle" },
    { key: "pendingAmount", label: "Total Pending/Rejected Refund Amount", icon: "bi-hourglass-split" },
    { key: "availableAmount", label: "Available For Refund", icon: "bi-wallet2" },
    { key: "yearName", label: "Year", icon: "bi-calendar" },
  ];

  const formatDateOnly = (value?: string | Date | null) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-IN");
  };

  const handleFetch = async (id: string) => {
    const response = await RefundContributionService.getRefundContributionById(Number(id));

    if (response.value) {
      response.value.deathDateString = formatDateOnly(response.value.deathDateString);
      response.value.dddateString = formatDateOnly(response.value.dddateString);

      if (response.value.memberId) {
        try {
          const eligibilityRes = await RefundContributionService.getMemberEligibility(response.value.memberId);
          if (eligibilityRes.isSucess && eligibilityRes.value) {
            (response.value as any).approvedAmount = eligibilityRes.value.approvedAmount;
            (response.value as any).pendingAmount = eligibilityRes.value.pendingAmount;
            (response.value as any).availableAmount = eligibilityRes.value.availableAmount;
          }
        } catch (err) {
          console.error("Failed to fetch refund eligibility:", err);
        }
      }
    }

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
      listRoute="/dashboard/claims/refundcontribution-list"
      editRoute="/dashboard/claims/refundcontribution-edit"
      auditLogConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
      attachmentConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
      themeColor="#1B3763"
      loadingText="Loading Refund details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this refund? This action cannot be undone."
      disableEditWhen={(data) => data.isApproved === true}
      disabledEditTooltip="This refund has already been approved and cannot be edited"
      disableDeleteWhen={(data) => data.isApproved === true}
      disabledDeleteTooltip="This refund has already been approved and cannot be deleted"
    />
  );
};

export default RefundContributionView;