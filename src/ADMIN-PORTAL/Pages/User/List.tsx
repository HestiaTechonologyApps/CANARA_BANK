import React from "react";
import type { User } from "../../Types/Settings/User.types";
import UserService from "../../Services/Settings/User.services";
import KiduServerTable from "../../../Components/KiduServerTable";


const columns = [
  { key: "userId", label: "User ID", enableSorting: true, type: "text" as const },
  { key: "userName", label: "User Name", enableSorting: true, type: "text" as const },
  { key: "userEmail", label: "Email", enableSorting: true, type: "text" as const },
  { key: "phoneNumber", label: "Phone", enableSorting: true, type: "text" as const },
  { key: "address", label: "Address", enableSorting: false, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
  { key: "companyId", label: "Company ID", enableSorting: true, type: "text" as const },
];

const UserList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: User[]; total: number }> => {
    try {
      // Fetch all users from the service
      const users = await UserService.getAllUsers();

      // Filter by search term if provided
      let filteredUsers = users;
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredUsers = users.filter(
          (user) =>
            user.userName?.toLowerCase().includes(searchLower) ||
            user.userEmail?.toLowerCase().includes(searchLower) ||
            user.phoneNumber?.toLowerCase().includes(searchLower) ||
            user.address?.toLowerCase().includes(searchLower)
        );
      }

      // Calculate pagination
      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        data: paginatedUsers,
        total: filteredUsers.length,
      };
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw new Error(error.message || "Failed to fetch users");
    }
  };

  return (
    <KiduServerTable
      title="User Management"
      subtitle="Manage system users with search, filter, and pagination"
      columns={columns}
      idKey="userId"
      addButtonLabel="Add User"
      addRoute="/dashboard/settings/user-create"
      editRoute="/dashboard/users/edit"
      viewRoute="/dashboard/users/view"
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

export default UserList;