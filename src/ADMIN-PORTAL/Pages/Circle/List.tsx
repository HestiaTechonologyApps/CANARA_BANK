// src/components/Circle/CircleList.tsx
import React from "react";
import CircleService from "../../Services/Settings/Circle.services";
import StateService from "../../Services/Settings/State.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const CircleList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
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

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "circleId", label: "Circle ID", enableSorting: true, type: "text" },
        { key: "circleCode", label: "Circle Code", enableSorting: true, type: "text" },
        { key: "name", label: "Circle Name", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
        { key: "stateName", label: "State", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      /* ================= KEYS ================= */
      idKey="circleId"

      /* ================= UI ================= */
      title="Circle Management"
      subtitle="Manage circles with search, filter, and pagination"
      addButtonLabel="Add Circle"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/circle-create"
      editRoute="/dashboard/settings/circle-edit"
      viewRoute="/dashboard/settings/circle-view"

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

export default CircleList;
