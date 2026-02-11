import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import ReportEngineService from "../../../Services/Settings/ReportEngine.services";
import type { ReportEngine } from "../../../Types/Settings/ReportEngine.types";
import KiduEdit from "../../../Components/KiduEdit";

const ReportEngineEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "Report Name", required: true, minLength: 2, maxLength: 100, colWidth: 6 } },
    { name: "description", rules: { type: "text", label: "Description", required: true, minLength: 2, maxLength: 500, colWidth: 6 } },
    { name: "sqlString", rules: { type: "textarea", label: "SQL Query", required: true, colWidth: 12 } },
    { name: "isActive", rules: { type: "checkbox", label: "Is Active", colWidth: 6 } },
  ];

  const handleFetch = async (reportEngineId: string) => {
    try {
      const response = await ReportEngineService.getReportEngineById(Number(reportEngineId));
      return response;
    } catch (error: any) {
      console.error("Error fetching report engine:", error);
      throw error;
    }
  };

  const handleUpdate = async (reportEngineId: string, formData: Record<string, any>) => {
    try {
      const payload: Omit<ReportEngine, "auditLogs"> = {
        reportEngineId: Number(reportEngineId),
        name: formData.name.trim(),
        description: formData.description.trim(),
        sqlString: formData.sqlString.trim(),
        isActive: formData.isActive ?? true,
        isDeleted: formData.isDeleted ?? false,
        createdDate: formData.createdDate,
        modifiedDate: formData.modifiedDate,
        createdDateString: formData.createdDateString,
        modifiedDateString: formData.modifiedDateString,
      };

      await ReportEngineService.updateReportEngine(Number(reportEngineId), payload);
    } catch (error: any) {
      console.error("Error updating report engine:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit Report Engine"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Report"
      showResetButton={true}
      successMessage="Report Engine updated successfully!"
      errorMessage="Failed to update report engine. Please try again."
      paramName="reportEngineId"
      navigateBackPath="/dashboard/settings/reportengine-list"
      loadingText="Loading Report Engine..."
      auditLogConfig={{ tableName: "ReportEngine", recordIdField: "reportEngineId", }}
      themeColor="#1B3763"
    />
  );
};

export default ReportEngineEdit;