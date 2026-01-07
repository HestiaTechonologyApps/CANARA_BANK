import React from "react";
import type { User } from "../../Types/Settings/User.types";
import type { Company } from "../../Types/Settings/Company.types";

import UserService from "../../Services/Settings/User.services";
import CompanyService from "../../Services/Settings/Company.services";

import KiduServerTable from "../../../Components/KiduServerTable";

/* ===================== TABLE COLUMNS ===================== */
const columns = [
  { key: "userId", label: "User ID", enableSorting: true, type: "text" as const },
  { key: "userName", label: "User Name", enableSorting: true, type: "text" as const },
  { key: "userEmail", label: "Email", enableSorting: true, type: "text" as const },
  { key: "phoneNumber", label: "Phone", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const UserList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      /* ===================== FETCH DATA ===================== */
      const [users, companies] = await Promise.all([
        UserService.getAllUsers(),
        CompanyService.getAllCompanies(),
      ]);

      /* ===================== CREATE LOOKUP MAP ===================== */
      const companyMap = Object.fromEntries(
        companies.map((c: Company) => [c.companyId, c.comapanyName])
      );

      /* ===================== ENRICH USERS ===================== */
      let enrichedUsers = users.map((u: User) => ({
        ...u,
        companyName: companyMap[u.companyId] ?? "-",
      }));

      /* ===================== SEARCH ===================== */
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        enrichedUsers = enrichedUsers.filter((u) =>
          [
            u.userName,
            u.userEmail,
            u.companyName,
            u.phoneNumber,
            u.address,
            u.role,
            u.userId,
          ]
            .map(String)
            .some((v) => v.toLowerCase().includes(q))
        );
      }

      /* ===================== SORT (latest first) ===================== */
      enrichedUsers.sort((a, b) => b.userId - a.userId);

      /* ===================== PAGINATION ===================== */
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: enrichedUsers.slice(start, end),
        total: enrichedUsers.length,
      };
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw new Error(error.message || "Failed to fetch users");
    }
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

export default UserList;
