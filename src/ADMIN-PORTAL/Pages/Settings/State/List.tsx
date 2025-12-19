import React from "react";
import StateService from "../../../Services/Settings/State.services";
import type { State } from "../../../Types/Settings/States.types";
import KiduServerTable from "../../../../Components/KiduServerTable";

const columns = [
  { key: "stateId", label: "ID", type: "text", enableSorting: true },
  { key: "name", label: "State Name", type: "text", enableSorting: true },
  { key: "abbreviation", label: "Abbreviation", type: "text", enableSorting: true },
  { key: "circleCode", label: "Circle Code", type: "text", enableSorting: true },
  { key: "isActive", label: "Active", type: "boolean", enableSorting: true }
];

const StateList: React.FC = () => {
  return (
    <KiduServerTable<State>
      title="State List"
      columns={columns}
      fetchData={StateService.getAllStates}
      createPath="/settings/state/create"
      editPath="/settings/state/edit"
      viewPath="/settings/state/view"
      deleteHandler={StateService.deleteState}
      rowIdKey="stateId"
    />
  );
};

export default StateList;
