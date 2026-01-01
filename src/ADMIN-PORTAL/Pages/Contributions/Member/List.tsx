import React from "react";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberService from "../../../Services/Contributions/Member.services";
import KiduServerTable from "../../../../Components/KiduServerTable";


const columns = [
  { key: "memberId", label: "Member ID", enableSorting: true, type: "text" as const },
  { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" as const },
  { key: "name", label: "Name", enableSorting: true, type: "text" as const },
  // { key: "genderId", label: "Gender ID", enableSorting: true, type: "text" as const },
   { key: "designationId", label: "Designation ID", enableSorting: true, type: "text" as const },
   { key: "categoryId", label: "Category ID", enableSorting: true, type: "text" as const },
   { key: "branchId", label: "Branch ID", enableSorting: true, type: "text" as const },

  // { key: "dobString", label: "DOB", enableSorting: false, type: "text" as const },
  // { key: "dojString", label: "DOJ", enableSorting: false, type: "text" as const },
  // { key: "dojtoSchemeString", label: "DOJ to Scheme", enableSorting: false, type: "text" as const },
  // { key: "statusId", label: "Status ID", enableSorting: true, type: "text" as const },
  { key: "isRegCompleted", label: "Reg. Completed", enableSorting: true, type: "checkbox" as const },
  { key: "unionMember", label: "Union Member", enableSorting: true, type: "text" as const },
];

const MemberList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Member[]; total: number }> => {
    try {
      const members = await MemberService.getAllMembers();

      let filtered = members;
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        filtered = members.filter((m) => {
          const fields = [
            m.name,
            String(m.staffNo),
            String(m.genderId),
            String(m.designationId),
            String(m.categoryId),
            String(m.branchId),
            m.dobString as string,
            m.dojString as string,
            m.dojtoSchemeString as string,
            String(m.statusId),
            String(m.isRegCompleted),
            m.unionMember,
            m.nominee,
            m.nomineeRelation,
          ];
          return fields.some((f) => (f ?? "").toString().toLowerCase().includes(q));
        });
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;
      const paginated = filtered.slice(start, end);

      return { data: paginated, total: filtered.length };
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

export default MemberList;
