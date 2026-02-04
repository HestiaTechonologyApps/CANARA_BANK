import React from "react";
import CircleService from "../../Services/Settings/Circle.services";
import StateService from "../../Services/Settings/State.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const CircleList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => {
        const [circles, states] = await Promise.all([
          CircleService.getAllCircles(),
          StateService.getAllStates(),
        ]);

        const stateMap = new Map(states.map(s => [s.stateId, s.name]));

        return circles.map(circle => ({
          ...circle,
          stateName: stateMap.get(circle.stateId) || "N/A",
        }));
      }}

      columns={[
        { key: "circleId", label: "Circle ID", enableSorting: true, type: "text" },
        { key: "circleCode", label: "Circle Code", enableSorting: true, type: "text" },
        { key: "name", label: "Circle Name", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
        { key: "stateName", label: "State", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      idKey="circleId"
      title="Circle Management"
      subtitle="Manage circles with search, filter, and pagination"
      addButtonLabel="Add Circle"
      addRoute="/dashboard/settings/circle-create"
      editRoute="/dashboard/settings/circle-edit"
      viewRoute="/dashboard/settings/circle-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default CircleList;
