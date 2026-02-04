import React from "react";
import MonthlyContributionService from "../../../Services/Contributions/MonthlyContribution.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const MonthlyContributionList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={MonthlyContributionService.getAllMonthlyContributions}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "monthlyContributionId", label: "ID", enableSorting: true, type: "text" },
        { key: "fileName", label: "File Name", enableSorting: true, type: "text" },
        { key: "fileType", label: "File Type", enableSorting: true, type: "text" },
        { key: "fileExtension", label: "Extension", enableSorting: true, type: "text" },
        { key: "monthName", label: "Month Code", enableSorting: true, type: "text" },
        { key: "yearName", label: "Year", enableSorting: true, type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="monthlyContributionId"

      /* ================= UI ================= */
      title="Monthly Contribution Management"
      addButtonLabel="Add Monthly Contribution"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/contributions/monthlyContribution-create"
      editRoute="/dashboard/contributions/monthlyContribution-edit"
      viewRoute="/dashboard/contributions/monthlyContribution-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default MonthlyContributionList;
