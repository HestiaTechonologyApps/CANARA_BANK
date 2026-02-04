import React from "react";
import StateService from "../../../Services/Settings/State.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const StateList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={StateService.getAllStates}

      columns={[
        { key: "stateId", label: "State ID", enableSorting: true, type: "text" },
        { key: "name", label: "State Name", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      idKey="stateId"
      title="State Management"
      subtitle="Manage states with search, filter, and pagination."
      addButtonLabel="Add State"
      addRoute="/dashboard/settings/state-create"
      editRoute="/dashboard/settings/state-edit"
      viewRoute="/dashboard/settings/state-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default StateList;
