import React from "react";
import ReportEngineService from "../../../Services/Settings/ReportEngine.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const ReportEngineList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={ReportEngineService.getAllReportEngines}

      columns={[
        { key: "reportEngineId", label: "ID", enableSorting: true, type: "text" },
        { key: "name", label: "Report Name", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      idKey="reportEngineId"
      title="Report Engine List"
      subtitle="Manage report engines with search, sort, and pagination"
      addButtonLabel="Add New"
      addRoute="/dashboard/settings/reportengine-create"
      editRoute="/dashboard/settings/reportengine-edit"
      viewRoute="/dashboard/settings/reportengine-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default ReportEngineList;