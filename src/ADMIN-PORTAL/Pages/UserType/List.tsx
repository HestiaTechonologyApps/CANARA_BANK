import React from "react";
import KiduServerTable from "../../../Components/KiduServerTable";
import type { UserType } from "../../Types/Settings/UserType.types";
import UserTypeService from "../../Services/Settings/UserType.services";

const columns = [
  { key: "userTypeId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" as const },
  { key: "description", label: "Description", enableSorting: true, type: "text" as const },
];

const UserTypeList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: UserType[]; total: number }> => {
    try {
      const userTypes = await UserTypeService.getAllUserTypes();

      let filtered = userTypes;
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        filtered = userTypes.filter(
          (t) =>
            t.abbreviation?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            String(t.userTypeId).includes(q)
        );
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;
      const paginated = filtered.slice(start, end);

      return { data: paginated, total: filtered.length };
    } catch (error: any) {
      console.error("Error fetching user types:", error);
      throw new Error(error.message || "Failed to fetch user types");
    }
  };

  return (
    <KiduServerTable
      title="User Type Management"
      subtitle="Manage user types with search and pagination"
      columns={columns}
      idKey="userTypeId"
      addButtonLabel="Add User Type"
      addRoute="/dashboard/settings/usertype-create"
      editRoute="/dashboard/settings/usertype-edit"
      viewRoute="/dashboard/settings/usertype-view"
      showAddButton
      showExport
      showSearch
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default UserTypeList;
