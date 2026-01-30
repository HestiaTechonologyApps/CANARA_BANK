import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import MonthlyContributionService from "../../../Services/Contributions/MonthlyContribution.services";
import KiduView from "../../../Components/KiduView";

const MonthlyContributionView: React.FC = () => {

  const fields: ViewField[] = [
    { key: "monthlyContributionId", label: "ID", icon: "bi-hash" },
    { key: "fileName", label: "File Name", icon: "bi-file-earmark" },
    { key: "fileType", label: "File Type", icon: "bi-filetype-pdf" },
    { key: "fileExtension", label: "Extension", icon: "bi-file-earmark-text" },
    { key: "fileSize", label: "File Size", icon: "bi-hdd" },
    { key: "monthCode", label: "Month Code", icon: "bi-calendar" },
    { key: "yearOf", label: "Year", icon: "bi-calendar2" },
  ];

  const handleFetch = async (id: string) => {
    const response = await MonthlyContributionService.getMonthlyContributionById(Number(id));
    return response;
  };

  const handleDelete = async (id: string) => {
    await MonthlyContributionService.deleteMonthlyContribution(Number(id));
  };

  return (
    <KiduView
      title="Monthly Contribution Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/contributions/monthly-contribution-edit"
      listRoute="/dashboard/contributions/monthly-contribution-list"
      paramName="monthlyContributionId"
      auditLogConfig={{ tableName: "MonthlyContribution", recordIdField: "monthlyContributionId" }}
      themeColor="#1B3763"
      showEditButton
      showDeleteButton
      deleteConfirmMessage="Are you sure you want to delete this record?"
    />
  );
};

export default MonthlyContributionView;
