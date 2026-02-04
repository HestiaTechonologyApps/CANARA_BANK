import React from "react";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const RefundContributionList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={RefundContributionService.getAllRefundContributions}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "refundContributionId", label: "Refund ID", enableSorting: true, type: "text" },
        { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" },
        { key: "memberName", label: "Member", enableSorting: true, type: "text" },
        { key: "designationName", label: "Designation", enableSorting: true, type: "text" },
        { key: "stateName", label: "State", enableSorting: true, type: "text" },
        { key: "refundNO", label: "Refund No", enableSorting: true, type: "text" },
        { key: "amount", label: "Amount", enableSorting: true, type: "text" },
        { key: "yearName", label: "Year", enableSorting: true, type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="refundContributionId"

      /* ================= UI ================= */
      title="Refund Contribution Management"
      subtitle="Manage refund contributions with search, filter, and pagination."
      addButtonLabel="Add Refund"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/claims/refundcontribution-create"
      editRoute="/dashboard/claims/refundcontribution-edit"
      viewRoute="/dashboard/claims/refundcontribution-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default RefundContributionList;
