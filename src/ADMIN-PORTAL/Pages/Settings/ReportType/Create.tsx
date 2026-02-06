import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import ReportTypeService from "../../../Services/Settings/ReportType.services";
import KiduCreate from "../../../Components/KiduCreate";

const ReportTypeCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "reportTypeName", rules: { type: "text", label: "Report Type Name", required: true, colWidth: 6 }, },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, colWidth: 6 },},
    { name: "isActive", rules: { type: "toggle", label: "Active" },},
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload = {
      reportTypeId: 0,
      reportTypeName: formData.reportTypeName?.trim(),
      description: formData.description?.trim(),
      createdDate: new Date().toISOString(),
      createdDateString: new Date().toLocaleString(),
      modifiedDate: new Date().toISOString(),
      modifiedDateString: new Date().toLocaleString(),
      isActive: Boolean(formData.isActive),
    };

    await ReportTypeService.createReportType(payload);
  };

  return (
    <KiduCreate
      title="Create Report Type"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Report Type"
      showResetButton
      successMessage="Report type created successfully!"
      errorMessage="Failed to create report type. Please try again."
      navigateOnSuccess="/dashboard/settings/reportType-list"
      navigateDelay={1200}
      themeColor="#1B3763"
    />
  );
};

export default ReportTypeCreate;
