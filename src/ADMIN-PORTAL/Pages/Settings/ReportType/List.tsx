import React from "react";
import ReportTypeService from "../../../Services/Settings/ReportType.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const ReportTypeList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => await ReportTypeService.getAllReportTypes()}
      columns={[
        { key: "reportTypeId", label: "ID", enableSorting: true, type: "text" },
        { key: "reportTypeName", label: "Report Type", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: false, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}
      idKey="reportTypeId"
      title="Report Type Management"
      subtitle="Manage report types with search and pagination."
      addButtonLabel="Add Type"
      addRoute="/dashboard/settings/reportType-create"
      editRoute="/dashboard/settings/reportType-edit"
      viewRoute="/dashboard/settings/reportType-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default ReportTypeList;
