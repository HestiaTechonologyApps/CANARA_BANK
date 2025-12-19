import React from "react";
import StateService from "../../../Services/Settings/State.services";
import KiduServerTable from "../../../../Components/KiduServerTable";
import type { State } from "../../../Types/Settings/States.types";

const columns = [
  { key: "stateId", label: "State ID", enableSorting: true, type: "text" as const },
  { key: "name", label: "State Name", enableSorting: true, type: "text" as const },
  { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const StateList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: State[]; total: number }> => {
    const states = await StateService.getAllStates();

    let filtered = states;
    if (params.searchTerm) {
      const search = params.searchTerm.toLowerCase();
      filtered = states.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.abbreviation.toLowerCase().includes(search) ||
          s.stateId.toString().includes(params.searchTerm)
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
    };
  };

  return (
    <KiduServerTable
      title="State Management"
      subtitle="Manage states"
      columns={columns}
      idKey="stateId"
      addButtonLabel="Add State"
      addRoute="/dashboard/settings/state-create"
      editRoute="/dashboard/settings/state-edit"
      viewRoute="/dashboard/settings/state-view"
      showAddButton
      showSearch
      showExport
      showActions
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default StateList;
