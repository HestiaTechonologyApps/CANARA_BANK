// src/ADMIN-PORTAL/Pages/Settings/ReportEngine/ReportEngineCreate.tsx
import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import ReportEngineService from "../../../Services/Settings/ReportEngine.services";
import KiduCreate from "../../../Components/KiduCreate";
import type { ReportEngine } from "../../../Types/Settings/ReportEngine.types";

const ReportEngineCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "Report Name", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "text", label: "Description", required: true, colWidth: 6 } },
    { name: "sqlString", rules: { type: "textarea", label: "SQL Query", required: true, colWidth: 12 } },
    { name: "isActive", rules: { type: "checkbox", label: "Is Active", colWidth: 6 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Omit<ReportEngine, "reportEngineId" | "auditLogs" | "createdDate" | "modifiedDate" | "createdDateString" | "modifiedDateString" | "isDeleted"> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      sqlString: formData.sqlString.trim(),
      isActive: formData.isActive ?? true,
    };
    await ReportEngineService.createReportEngine(payload as ReportEngine);
  };

  return (
    <KiduCreate
      title="Create Report Engine"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Report"
      showResetButton
      successMessage="Report Engine created successfully!"
      errorMessage="Failed to create report engine. Please try again."
      navigateOnSuccess="/dashboard/settings/reportengine-list"
      themeColor="#1B3763"
    />
  );
};

export default ReportEngineCreate;