import React from "react";
import MonthlyContributionService from "../../../Services/Contributions/MonthlyContribution.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const MonthlyContributionList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={MonthlyContributionService.getAllMonthlyContributions}
      columns={[
        { key: "monthlyContributionId", label: "ID", enableSorting: true, type: "text" },
        { key: "fileName", label: "File Name", enableSorting: true, type: "text" },
        { key: "fileType", label: "File Type", enableSorting: true, type: "text" },
        { key: "fileExtension", label: "Extension", enableSorting: true, type: "text" },
        { key: "monthName", label: "Month", enableSorting: true, type: "text" },
        { key: "yearName", label: "Year", enableSorting: true, type: "text" },
      ]}

      idKey="monthlyContributionId"
      title="Monthly Contribution Management"
      addButtonLabel="Add Monthly Contribution"
      addRoute="/dashboard/contributions/monthlyContribution-create"
      editRoute="/dashboard/contributions/monthlyContribution-edit"
      viewRoute="/dashboard/contributions/monthlyContribution-view"
      showAddButton={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default MonthlyContributionList;
