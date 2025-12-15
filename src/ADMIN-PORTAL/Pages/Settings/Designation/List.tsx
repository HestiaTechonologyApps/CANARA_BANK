// src/components/Designation/DesignationList.tsx
import React from "react";
import type { Designation } from "../../../Types/Settings/Designation";
import DesignationService from "../../../Services/Settings/Designation.services";
import KiduServerTable from "../../../../Components/KiduServerTable";


const columns = [
  { key: "designationId", label: "Designation ID", enableSorting: true, type: "text" as const },
  { key: "name", label: "Designation Name", enableSorting: true, type: "text" as const },
  { key: "description", label: "Description", enableSorting: false, type: "text" as const }
];

const DesignationList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Designation[]; total: number }> => {
    try {
      const designations = await DesignationService.getAllDesignations();

      let filteredDesignations = designations;
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredDesignations = designations.filter(
          (designation) =>
            designation.name?.toLowerCase().includes(searchLower) ||
            designation.description?.toLowerCase().includes(searchLower)
        );
      }

      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedDesignations = filteredDesignations.slice(startIndex, endIndex);

      return {
        data: paginatedDesignations,
        total: filteredDesignations.length,
      };
    } catch (error: any) {
      console.error("Error fetching designations:", error);
      throw new Error(error.message || "Failed to fetch designations");
    }
  };

  return (
    <KiduServerTable
      title="Designation Management"
      subtitle="Manage designations with search, filter, and pagination"
      columns={columns}
      idKey="designationId"
      addButtonLabel="Add Designation"
      addRoute="/dashboard/settings/designation-create"
      editRoute="/dashboard/settings/designation-edit"
      viewRoute="/dashboard/settings/designation-view"
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

export default DesignationList;