import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import ReportEngineService from "../../../Services/Settings/ReportEngine.services";
import KiduView from "../../../Components/KiduView";

const ReportEngineView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "reportEngineId", label: "Report Engine ID" },
    { key: "name", label: "Report Name" },
    { key: "description", label: "Description" },
    { key: "sqlString", label: "SQL Query" },
    { key: "isActive", label: "Is Active" },
    { key: "createdDateString", label: "Created Date" },
    { key: "modifiedDateString", label: "Modified Date" },
  ];

 const formatDateOnly = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN");
};

const handleFetch = async (reportEngineId: string) => {
  const response = await ReportEngineService.getReportEngineById(Number(reportEngineId));

  if (response.value) {
    response.value.createdDateString = formatDateOnly(response.value.createdDateString);
    response.value.modifiedDateString = formatDateOnly(response.value.modifiedDateString);
  }

  return response;
};

  const handleDelete = async (reportEngineId: string) => {
    await ReportEngineService.deleteReportEngine(Number(reportEngineId));
  };

  return (
    <KiduView
      title="Report Engine Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="reportEngineId"
      editRoute="/dashboard/settings/reportengine-edit"
      listRoute="/dashboard/settings/reportengine-list"
      auditLogConfig={{ tableName: "ReportEngine", recordIdField: "reportEngineId",}}
      themeColor="#1B3763"
      loadingText="Loading report engine details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this report engine? This action cannot be undone."
    />
  );
};

export default ReportEngineView;