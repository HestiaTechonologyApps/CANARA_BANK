// src/components/ManagingCommittee/ManagingCommitteeList.tsx

import React from "react";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "managingComitteeId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "managingComitteeName", label: "Name", enableSorting: true, type: "text" as const },
  { key: "position", label: "Position", enableSorting: true, type: "text" as const },
  { key: "description1", label: "Description 1", enableSorting: false, type: "text" as const },
  { key: "description2", label: "Description 2", enableSorting: false, type: "text" as const },
  { key: "imageLocation", label: "Image URL", enableSorting: false, type: "text" as const },
  { key: "companyId", label: "Company ID", enableSorting: true, type: "text" as const },
  { key: "companyName", label: "Company Name", enableSorting: true, type: "text" as const },
  { key: "order", label: "Order", enableSorting: true, type: "text" as const },
];

const ManagingCommitteeList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: ManagingCommittee[]; total: number }> => {
    try {
      const members = await ManagingCommitteeService.getAllManagingCommittees();

      // 🔍 Filter by search term
      let filtered = members;
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        filtered = members.filter((m) =>
          m.managingComitteeName?.toLowerCase().includes(q) ||
          m.position?.toLowerCase().includes(q) ||
          m.description1?.toLowerCase().includes(q) ||
          m.description2?.toLowerCase().includes(q) ||
          m.companyName?.toLowerCase().includes(q) ||
          String(m.companyId)?.includes(q) ||
          String(m.order)?.includes(q)
        );
      }

      // 🔢 Pagination
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;
      const paginated = filtered.slice(start, end);

      return { data: paginated, total: filtered.length };
    } catch (error: any) {
      console.error("Error fetching managing committee:", error);
      throw new Error(error.message || "Failed to fetch managing committee");
    }
  };

  return (
    <KiduServerTable
      title="Managing Committee"
      subtitle="Manage committee members with search, filter, and pagination"
      columns={columns}
      idKey="managingComitteeId"
      addButtonLabel="Add Member"
      addRoute="/dashboard/cms/manage-committe-create"
      editRoute="/dashboard/cms/manage-committe-edit"
      viewRoute="/dashboardcms/manage-committe-view"
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

export default ManagingCommitteeList;
