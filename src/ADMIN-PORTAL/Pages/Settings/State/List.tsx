import React from "react";
import StateService from "../../../Services/Settings/State.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const StateList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={StateService.getAllStates}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "stateId", label: "State ID", enableSorting: true, type: "text" },
        { key: "name", label: "State Name", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      /* ================= KEYS ================= */
      idKey="stateId"

      /* ================= UI ================= */
      title="State Management"
      subtitle="Manage states with search, filter, and pagination."
      addButtonLabel="Add State"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/state-create"
      editRoute="/dashboard/settings/state-edit"
      viewRoute="/dashboard/settings/state-view"

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

export default StateList;
