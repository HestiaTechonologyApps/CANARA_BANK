// src/components/User/UserList.tsx
import React from "react";
import type { User } from "../../Types/Settings/User.types";
import UserService from "../../Services/Settings/User.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "userId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "userName", label: "User Name", enableSorting: true, type: "text" as const },
  { key: "userEmail", label: "Email", enableSorting: true, type: "text" as const },
  { key: "phoneNumber", label: "Phone", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const UserList: React.FC = () => {
  const fetchData = async ({ pageNumber, pageSize, searchTerm }: any) => {
    /* 1️⃣ Fetch users only */
    const users = await UserService.getAllUsers();

    /* 2️⃣ Search */
    let filtered = users;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = users.filter((u: User) =>
        [
          u.userId,
          u.userName,
          u.userEmail,
          u.phoneNumber,
        ]
          .filter(Boolean)
          .map(String)
          .some((v) => v.toLowerCase().includes(q))
      );
    }

    /* 3️⃣ Pagination */
    const start = (pageNumber - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
    };
  };

  return (
    <KiduServerTable
      title="User Management"
      subtitle="Manage system users with search and pagination"
      columns={columns}
      idKey="userId"
      addButtonLabel="Add User"
      addRoute="/dashboard/settings/user-create"
      editRoute="/dashboard/settings/user-edit"
      viewRoute="/dashboard/settings/user-view"
      fetchData={fetchData}
      showAddButton
      showSearch
      showActions
      showExport
    />
  );
};

export default UserList;
