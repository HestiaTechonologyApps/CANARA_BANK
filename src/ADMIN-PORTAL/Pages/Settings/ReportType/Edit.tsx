import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import ReportTypeService from "../../../Services/Settings/ReportType.services";
import KiduEdit from "../../../Components/KiduEdit";

const ReportTypeEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "reportTypeName", rules: { type: "text", label: "Report Type Name", required: true, colWidth: 6 }, },
    { name: "description", rules: { type: "textarea", label: "Description", required: false, colWidth: 6 },},
    { name: "isActive", rules: { type: "toggle", label: "Active" }, },
  ];

  const handleFetch = async (id: string) => {
    return await ReportTypeService.getReportTypeById(Number(id));
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload = {
      reportTypeId: Number(id),
      reportTypeName: formData.reportTypeName?.trim(),
      description: formData.description?.trim(),
      modifiedDate: new Date().toISOString(),
      modifiedDateString: new Date().toLocaleString(),
      isActive: Boolean(formData.isActive),
    };

    await ReportTypeService.updateReportType(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Report Type"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Report Type"
      showResetButton
      successMessage="Report type updated successfully!"
      errorMessage="Failed to update report type."
      loadingText="Loading report type details..."
      paramName="reportTypeId"
      navigateBackPath="/dashboard/settings/reportType-list"
      auditLogConfig={{ tableName: "ReportType", recordIdField: "reportTypeId", }}
      themeColor="#1B3763"
    />
  );
};

export default ReportTypeEdit;
