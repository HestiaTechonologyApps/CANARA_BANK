import React from "react";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberService from "../../../Services/Contributions/Member.services";
import KiduServerTable from "../../../../Components/KiduServerTable";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../../Assets/Images/profile.jpg";

const columns = [
  { key: "memberId", label: "Member ID", enableSorting: true, type: "text" as const },
  { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" as const },
  { key: "profileImageSrc", label: "Photo", enableSorting: false, type: "image" as const, imageConfig: { width: 40, height: 40, isCircle: true, defaultImage: defaultProfileImage } },
  { key: "name", label: "Name", enableSorting: true, type: "text" as const },
  { key: "designationName", label: "Designation", enableSorting: true, type: "text" as const },
  { key: "categoryname", label: "Category", enableSorting: true, type: "text" as const },
  { key: "branchName", label: "Branch", enableSorting: true, type: "text" as const },
  { key: "status", label: "Status", enableSorting: true, type: "text" as const },
  { key: "isRegCompleted", label: "Reg. Completed", enableSorting: true, type: "checkbox" as const }
];

const MemberList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      let members = await MemberService.getAllMembers();

      members = members.map((member: Member) => ({
        ...member,
        profileImageSrc: member.profileImageSrc
          ? getFullImageUrl(member.profileImageSrc)
          : defaultProfileImage
      }));

      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        members = members.filter((m: Member) =>
          [
            m.name,
            m.staffNo?.toString(),
            m.branchName,
            m.designationName,
            m.categoryname,
            m.status,
            m.unionMember
          ]
            .filter(Boolean)
            .map(String)
            .some(v => v.toLowerCase().includes(q))
        );
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: members.slice(start, end),
        total: members.length
      };
    } catch (error: any) {
      console.error("Error fetching members:", error);
      throw new Error(error.message || "Failed to fetch members");
    }
  };

  return (
    <KiduServerTable
      title="Member Management"
      subtitle="Manage members with search, filter, and pagination."
      columns={columns}
      idKey="memberId"
      addButtonLabel="Add Member"
      addRoute="/dashboard/contributions/member-create"
      editRoute="/dashboard/contributions/member-edit"
      viewRoute="/dashboard/contributions/member-view"
      fetchData={fetchData}
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default MemberList;
