import React from "react";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Designation } from "../../../Types/Settings/Designation";
import type { Category } from "../../../Types/Settings/Category.types";
import type { Status } from "../../../Types/Settings/Status.types";
import MemberService from "../../../Services/Contributions/Member.services";
import BranchService from "../../../Services/Settings/Branch.services";
import DesignationService from "../../../Services/Settings/Designation.services";
import CategoryService from "../../../Services/Settings/Category.services";
import StatusService from "../../../Services/Settings/Status.services";

import KiduServerTable from "../../../../Components/KiduServerTable";

/* ===================== TABLE COLUMNS ===================== */
const columns = [
  { key: "memberId", label: "Member ID", enableSorting: true, type: "text" as const },
  { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" as const },
  { key: "name", label: "Name", enableSorting: true, type: "text" as const },
  { key: "designationName", label: "Designation", enableSorting: true, type: "text" as const },
  { key: "categoryName", label: "Category", enableSorting: true, type: "text" as const },
  { key: "branchName", label: "Branch", enableSorting: true, type: "text" as const },
  { key: "statusName",  label: "Status", enableSorting: true, type: "text" as const },
  { key: "isRegCompleted", label: "Reg. Completed", enableSorting: true, type: "checkbox" as const },
];

const MemberList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      /* ===================== FETCH ALL DATA ===================== */
      const [
        members,
        branches,
        designations,
        categories,
        statuses,
      ] = await Promise.all([
        MemberService.getAllMembers(),
        BranchService.getAllBranches(),
        DesignationService.getAllDesignations(),
        CategoryService.getAllCategories(),
        StatusService.getAllStatuses(),
      ]);

      /* ===================== CREATE LOOKUP MAPS ===================== */
      const branchMap = Object.fromEntries(
        branches.map((b: Branch) => [b.branchId, `${b.dpCode} - ${b.name}`])
      );

      const designationMap = Object.fromEntries(
        designations.map((d: Designation) => [d.designationId, d.name])
      );

      const categoryMap = Object.fromEntries(
        categories.map((c: Category) => [c.categoryId, c.name])
      );

      const statusMap = Object.fromEntries(
        statuses.map((s: Status) => [s.statusId, s.name])
      );

      /* ===================== ENRICH MEMBERS ===================== */
      let enrichedMembers = members.map((m: Member) => ({
        ...m,
        branchName: branchMap[m.branchId] ?? "-",
        designationName: designationMap[m.designationId] ?? "-",
        categoryName: categoryMap[m.categoryId] ?? "-",
        statusName: statusMap[m.statusId] ?? "-",
      }));

      /* ===================== SEARCH ===================== */
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        enrichedMembers = enrichedMembers.filter((m) =>
          [
            m.name,
            m.staffNo,
            m.branchName,
            m.designationName,
            m.categoryName,
            m.statusName,
            m.unionMember,
          ]
            .map(String)
            .some((v) => v.toLowerCase().includes(q))
        );
      }

      /* ===================== PAGINATION ===================== */
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: enrichedMembers.slice(start, end),
        total: enrichedMembers.length,
      };
    } catch (error: any) {
      console.error("Error fetching members:", error);
      throw new Error(error.message || "Failed to fetch members");
    }
  };

  return (
    <KiduServerTable
      title="Member Management"
      subtitle="Manage members with search and pagination"
      columns={columns}
      idKey="memberId"
      addButtonLabel="Add Member"
      addRoute="/dashboard/contributions/member-create"
      editRoute="/dashboard/contributions/member-edit"
      viewRoute="/dashboard/contributions/member-view"
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

export default MemberList;
