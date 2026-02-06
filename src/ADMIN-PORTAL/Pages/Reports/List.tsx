import React from "react";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import ReportService from "../../Services/Reports/Reports.services";

const ReportsList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => await ReportService.getAllReports()}
      columns={[
        { key: "reportId", label: "Report ID", enableSorting: true, type: "text" },
        { key: "reportType", label: "Report Type", enableSorting: true, type: "text" },
        { key: "yearName", label: "Year", enableSorting: true, type: "text" },
        { key: "monthName", label: "Month", enableSorting: true, type: "text" },
        { key: "circleName", label: "Circle", enableSorting: true, type: "text" },
        { key: "branchName", label: "Branch", enableSorting: true, type: "text" },
        { key: "memberName", label: "Member", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}
      idKey="reportId"
      title="Reports Management"
      subtitle="Manage reports with search, filter, and pagination."
      addButtonLabel="Add Report"
      addRoute="/dashboard/report-create"
      editRoute="/dashboard/report-edit"
      viewRoute="/dashboard/report-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default ReportsList;
