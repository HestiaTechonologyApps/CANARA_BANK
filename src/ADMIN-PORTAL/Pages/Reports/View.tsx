import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import ReportService from "../../Services/Reports/Reports.services";

const ReportsView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "reportId", label: "Report ID", icon: "bi-hash" },
    { key: "reportType", label: "Report Type", icon: "bi-file-text" },
    { key: "yearName", label: "Year", icon: "bi-calendar" },
    { key: "monthName", label: "Month", icon: "bi-calendar-month" },
    { key: "circleName", label: "Circle", icon: "bi-diagram-3" },
    { key: "branchName", label: "Branch", icon: "bi-building" },
    { key: "memberName", label: "Member", icon: "bi-person" },
    { key: "staffNo", label: "Staff Number", icon: "bi-person-badge" },
    { key: "createdDateString", label: "Created Date", icon: "bi-clock" },
    { key: "modifiedDateString", label: "Modified Date", icon: "bi-clock-history" },
    { key: "isActive", label: "Active", icon: "bi-check-circle", isBoolean: true },
  ];

  // ✅ Safe Date Formatter
  const formatDateOnly = (value?: string | Date | null) => {
    if (!value) return "N/A";

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-IN");
  };

  const handleFetch = async (id: string) => {
    const res = await ReportService.getReportById(Number(id));

    if (res?.value) {
      res.value.createdDateString = formatDateOnly(res.value.createdDateString);
      res.value.modifiedDateString = formatDateOnly(res.value.modifiedDateString);
    }

    return res;
  };

  const handleDelete = async (id: string) => {
    await ReportService.deleteReport(Number(id));
  };

  return (
    <KiduView
      title="Report Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/report-edit"
      listRoute="/dashboard/report-list"
      paramName="reportId"
      auditLogConfig={{ tableName: "Report", recordIdField: "reportId" }}
      themeColor="#1B3763"
      showEditButton
      showDeleteButton
      deleteConfirmMessage="Are you sure you want to delete this report? This action cannot be undone."
    />
  );
};

export default ReportsView;