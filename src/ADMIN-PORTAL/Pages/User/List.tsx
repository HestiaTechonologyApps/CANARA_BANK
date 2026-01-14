// src/components/User/UserList.tsx
import React from "react";
import type { User } from "../../Types/Settings/User.types";
import type { Company } from "../../Types/Settings/Company.types";
import type { Member } from "../../Types/Contributions/Member.types";

import UserService from "../../Services/Settings/User.services";
import CompanyService from "../../Services/Settings/Company.services";
import MemberService from "../../Services/Contributions/Member.services";

import KiduServerTable from "../../../Components/KiduServerTable";

/* ===================== TABLE COLUMNS ===================== */
const columns = [
  { key: "userId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "userName", label: "User Name", enableSorting: true, type: "text" as const },
  { key: "staffName", label: "Staff", enableSorting: true, type: "text" as const },
  { key: "companyName", label: "Company", enableSorting: true, type: "text" as const },
  { key: "userEmail", label: "Email", enableSorting: true, type: "text" as const },
  { key: "phoneNumber", label: "Phone", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const UserList: React.FC = () => {
  const fetchData = async ({ pageNumber, pageSize, searchTerm }: any) => {
    /* 1️⃣ Fetch all data */
    const [users, companies, members] = await Promise.all([
      UserService.getAllUsers(),
      CompanyService.getAllCompanies(),
      MemberService.getAllMembers(),
    ]);

    /* 2️⃣ Create lookup maps */

    // CompanyId -> Company Name
    const companyMap = new Map<number, string>(
      companies.map((c: Company) => [c.companyId, c.comapanyName])
    );

    // StaffNo -> Member Name
    const memberMap = new Map<number, string>(
      members.map((m: Member) => [m.staffNo, m.name])
    );

    /* 3️⃣ Enrich users with DISPLAY fields */
    const enrichedUsers = users.map((u: User) => ({
      ...u,
      companyName: companyMap.get(u.companyId) ?? "-",
      staffName: memberMap.get(u.staffNo) ?? "-",
    }));

    /* 4️⃣ Search */
    let filtered = enrichedUsers;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = enrichedUsers.filter((u) =>
        [
          u.userId,
          u.userName,
          u.staffName,
          u.companyName,
          u.userEmail,
          u.phoneNumber,
        ]
          .filter(Boolean)
          .map(String)
          .some((v) => v.toLowerCase().includes(q))
      );
    }

    /* 5️⃣ Pagination */
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
