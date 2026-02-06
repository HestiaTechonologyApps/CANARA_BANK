import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import ReportService from "../../Services/Reports/Reports.services";

const ReportsEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "reportType", rules: { type: "text", label: "Report Type", required: true, colWidth: 6 } },
    { name: "yearOf", rules: { type: "number", label: "Year Of", required: true, colWidth: 6 } },
    { name: "yearName", rules: { type: "text", label: "Year Name", required: true, colWidth: 6 } },
    { name: "monthCode", rules: { type: "number", label: "Month Code", required: true, colWidth: 6 } },
    { name: "monthName", rules: { type: "text", label: "Month Name", required: true, colWidth: 6 } },
    { name: "circleId", rules: { type: "number", label: "Circle ID", required: true, colWidth: 6 } },
    { name: "circleName", rules: { type: "text", label: "Circle Name", required: true, colWidth: 6 } },
    { name: "branchId", rules: { type: "number", label: "Branch ID", required: true, colWidth: 6 } },
    { name: "dpCode", rules: { type: "number", label: "DP Code", required: true, colWidth: 6 } },
    { name: "branchName", rules: { type: "text", label: "Branch Name", required: true, colWidth: 6 } },
    { name: "memberId", rules: { type: "number", label: "Member ID", required: true, colWidth: 6 } },
    { name: "memberName", rules: { type: "text", label: "Member Name", required: true, colWidth: 6 } },
    { name: "staffNo", rules: { type: "number", label: "Staff Number", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

  const handleFetch = async (id: string) => {
    const response = await ReportService.getReportById(Number(id));
    return response;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload = {
      reportId: Number(id),
      reportType: formData.reportType?.trim(),
      yearOf: Number(formData.yearOf),
      yearName: formData.yearName?.trim(),
      monthCode: Number(formData.monthCode),
      monthName: formData.monthName?.trim(),
      circleId: Number(formData.circleId),
      circleName: formData.circleName?.trim(),
      branchId: Number(formData.branchId),
      dpCode: Number(formData.dpCode),
      branchName: formData.branchName?.trim(),
      memberId: Number(formData.memberId),
      memberName: formData.memberName?.trim(),
      staffNo: Number(formData.staffNo),
      createdDate: formData.createdDate || new Date().toISOString(),
      createdDateString: formData.createdDateString || new Date().toLocaleString(),
      modifiedDate: new Date().toISOString(),
      modifiedDateString: new Date().toLocaleString(),
      isActive: Boolean(formData.isActive),
    };

    await ReportService.updateReport(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Report"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Report"
      showResetButton
      successMessage="Report updated successfully!"
      errorMessage="Failed to update report."
      loadingText="Loading Report details..."
      paramName="reportId"
      navigateBackPath="/dashboard/report-list"
      auditLogConfig={{
        tableName: "Reports",
        recordIdField: "reportId",
      }}
      themeColor="#1B3763"
    />
  );
};

export default ReportsEdit;
