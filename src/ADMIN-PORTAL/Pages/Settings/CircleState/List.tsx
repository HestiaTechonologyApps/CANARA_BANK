import React from "react";
import CircleStateService from "../../../Services/Settings/CircleState.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const CircleStateList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={CircleStateService.getAllCircleStates}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "circleId", label: "Circle ID", enableSorting: true, type: "text" },
        { key: "stateId", label: "State ID", enableSorting: true, type: "text" },
        { key: "createdDate", label: "Created Date", enableSorting: true, type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="id"

      /* ================= UI ================= */
      title="Circle-State"
      subtitle="Manage Circle State with search, filter, and pagination."
      addButtonLabel="Add circle-state"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/circle-state-create"
      editRoute="/dashboard/settings/circle-state-edit"
      viewRoute="/dashboard/settings/circle-state-view"

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

export default CircleStateList;
