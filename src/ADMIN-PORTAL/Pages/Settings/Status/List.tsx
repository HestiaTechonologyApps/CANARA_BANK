import React from "react";
import StatusService from "../../../Services/Settings/Status.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const StatusList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={StatusService.getAllStatuses}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "statusId", label: "Status ID", enableSorting: true, type: "text" },
        { key: "name", label: "Name", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: false, type: "text" },
        { key: "groupId", label: "Group ID", enableSorting: true, type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="statusId"

      /* ================= UI ================= */
      title="Status Management"
      subtitle="Manage system statuses with search, filter, and pagination"
      addButtonLabel="Add Status"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/status-create"
      editRoute="/dashboard/settings/status-edit"
      viewRoute="/dashboard/settings/status-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default StatusList;
