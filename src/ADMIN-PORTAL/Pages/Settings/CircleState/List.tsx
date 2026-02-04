import React from "react";
import CircleStateService from "../../../Services/Settings/CircleState.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const CircleStateList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={CircleStateService.getAllCircleStates}

      columns={[
        { key: "circleId", label: "Circle ID", enableSorting: true, type: "text" },
        { key: "stateId", label: "State ID", enableSorting: true, type: "text" },
        { key: "createdDate", label: "Created Date", enableSorting: true, type: "text" },
      ]}

      idKey="id"
      title="Circle-State"
      subtitle="Manage Circle State with search, filter, and pagination."
      addButtonLabel="Add circle-state"
      addRoute="/dashboard/settings/circle-state-create"
      editRoute="/dashboard/settings/circle-state-edit"
      viewRoute="/dashboard/settings/circle-state-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default CircleStateList;
