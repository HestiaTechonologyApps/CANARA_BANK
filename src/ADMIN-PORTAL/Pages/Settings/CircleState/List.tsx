// src/components/CircleState/CircleStateList.tsx
import React from "react";
import CircleStateService from "../../../Services/Settings/CircleState.services";
import KiduServerTable from "../../../../Components/KiduServerTable";


const columns = [
  { key: "circleId", label: "Circle ID", enableSorting: true, type: "text" as const },
  { key: "stateId", label: "State ID", enableSorting: true, type: "text" as const },
  { key: "createdDate", label: "Created Date", enableSorting: true, type: "text" as const, },
];

const CircleStateList: React.FC = () => {
  const fetchData = async () => {
    const data = await CircleStateService.getAllCircleStates();
    return { data, total: data.length };
  };

  return (
    <KiduServerTable
      title="Circle-State Mapping"
      subtitle="Manage Circle and State relationships"
      columns={columns}
      idKey="id"
      addRoute="/dashboard/settings/circle-state-create"
      editRoute="/dashboard/settings/circle-state-edit"
      viewRoute="/dashboard/settings/circle-state-view"
      fetchData={fetchData}
      showAddButton
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default CircleStateList;
