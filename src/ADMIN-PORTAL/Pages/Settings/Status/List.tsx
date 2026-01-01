import React from "react";
import type { Status } from "../../../Types/Settings/Status.types";
import KiduServerTable from "../../../../Components/KiduServerTable";
import StatusService from "../../../Services/Settings/Status.services";

const columns = [
  { key: "statusId", label: "Status ID", enableSorting: true, type: "text" as const },
  { key: "name", label: "Name", enableSorting: true, type: "text" as const },
  { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" as const },
  { key: "description", label: "Description", enableSorting: false, type: "text" as const },
  { key: "groupId", label: "Group ID", enableSorting: true, type: "text" as const },
];

const StatusList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Status[]; total: number }> => {
    try {
      const statuses = await StatusService.getAllStatuses();
      let filteredStatuses = statuses;
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredStatuses = statuses.filter(
          (status) =>
            status.statusId?.toString().includes(searchLower) ||
            status.name?.toLowerCase().includes(searchLower) ||
            status.abbreviation?.toLowerCase().includes(searchLower) ||
            status.description?.toLowerCase().includes(searchLower) ||
            status.groupId?.toString().includes(searchLower)
        );
      }
      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedStatuses = filteredStatuses.slice(startIndex, endIndex);

      return {
        data: paginatedStatuses,
        total: filteredStatuses.length,
      };
    } catch (error: any) {
      console.error("Error fetching statuses:", error);
      throw new Error(error.message || "Failed to fetch statuses");
    }
  };

  return (
    <KiduServerTable
      title="Status Management"
      subtitle="Manage system statuses with search, filter, and pagination"
      columns={columns}
      idKey="statusId"
      addButtonLabel="Add Status"
      addRoute="/dashboard/settings/status-create"
      editRoute="/dashboard/settings/status-edit"
      viewRoute="/dashboard/settings/status-view"
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

export default StatusList;