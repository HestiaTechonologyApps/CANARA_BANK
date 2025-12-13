import React from "react";
import type { State } from "../../../Types/Settings/States.types";
import StateService from "../../../Services/Settings/State.services";
import KiduServerTable from "../../../../Components/KiduServerTable";


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
    try {
      // Fetch all states from the service
      const states = await StateService.getAllStates();

      // Filter by search term if provided
      let filteredStates = states;
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredStates = states.filter(
          (state) =>
            state.name?.toLowerCase().includes(searchLower) ||
            state.abbreviation?.toLowerCase().includes(searchLower) ||
            String(state.stateId)?.includes(searchLower)
        );
      }

      // Calculate pagination
      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedStates = filteredStates.slice(startIndex, endIndex);

      return {
        data: paginatedStates,
        total: filteredStates.length,
      };
    } catch (error: any) {
      console.error("Error fetching states:", error);
      throw new Error(error.message || "Failed to fetch states");
    }
  };

  return (
    <KiduServerTable
      title="State Management"
      subtitle="Manage states with search, filter, and pagination"
      columns={columns}
      idKey="stateId"
      addButtonLabel="Add State"
      addRoute="/dashboard/settings/state-create"
      editRoute="/dashboard/settings/state-edit"
      viewRoute="/dashboard/settings/state-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default StateList;