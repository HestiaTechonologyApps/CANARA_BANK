// src/components/Branch/BranchList.tsx
import React from "react";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchService from "../../Services/Settings/Branch.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "branchId", label: "Branch ID", enableSorting: true, type: "text" as const },
  { key: "dpCode", label: "DP Code", enableSorting: true, type: "text" as const },
  { key: "name", label: "Branch Name", enableSorting: true, type: "text" as const },
  // { key: "address1", label: "Address 1", enableSorting: false, type: "text" as const },
  // { key: "address2", label: "Address 2", enableSorting: false, type: "text" as const },
  // { key: "address3", label: "Address 3", enableSorting: false, type: "text" as const },
  { key: "district", label: "District", enableSorting: true, type: "text" as const },
  { key: "status", label: "Active", enableSorting: true, type: "checkbox" as const },
  { key: "circleId", label: "Circle ID", enableSorting: true, type: "text" as const },
  { key: "stateId", label: "State ID", enableSorting: true, type: "text" as const },
  { key: "isRegCompleted", label: "Reg. Completed", enableSorting: true, type: "checkbox" as const },
];

const BranchList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Branch[]; total: number }> => {
    try {
      const branches = await BranchService.getAllBranches();
      let filtered = branches;
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        filtered = branches.filter((b) => {
          const statusStr = String(b.status); 
          return (
            b.name?.toLowerCase().includes(q) ||
            String(b.dpCode)?.toLowerCase().includes(q) ||
            b.address1?.toLowerCase().includes(q) ||
            b.address2?.toLowerCase().includes(q) ||
            b.address3?.toLowerCase().includes(q) ||
            b.district?.toLowerCase().includes(q) ||
            String(b.circleId)?.toLowerCase().includes(q) ||
            String(b.stateId)?.toLowerCase().includes(q) ||
            statusStr.includes(q)
          );
        });
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;
      const paginated = filtered.slice(start, end);

      return {
        data: paginated,
        total: filtered.length,
      };
    } catch (error: any) {
      console.error("Error fetching branches:", error);
      throw new Error(error.message || "Failed to fetch branches");
    }
  };

  return (
    <KiduServerTable
      title="Branch Management"
      subtitle="Manage branches with search, filter, and pagination"
      columns={columns}
      idKey="branchId"
      addButtonLabel="Add Branch"
      addRoute="/dashboard/settings/branch-create"
      editRoute="/dashboard/settings/branch-edit"
      viewRoute="/dashboard/settings/branch-view"
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

export default BranchList;
