// MemberList.tsx - Member management list page
import React from "react";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberService from "../../../Services/Contributions/Member.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../../Assets/Images/profile.jpg";

const MemberList: React.FC = () => {
  return (
    <KiduServerTableList
      // Data fetching
      fetchService={MemberService.getAllMembers}
      transformData={(members: Member[]) => 
        members.map(member => ({
          ...member,
          profileImageSrc: member.profileImageSrc
            ? getFullImageUrl(member.profileImageSrc)
            : defaultProfileImage
        }))
      }
      
      // Table columns configuration
      columns={[
        { key: "memberId", label: "Member ID", enableSorting: true, type: "text" },
        { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" },
        { key: "profileImageSrc", label: "Photo", enableSorting: false, type: "image" },
        { key: "name", label: "Name", enableSorting: true, type: "text" },
        { key: "designationName", label: "Designation", enableSorting: true, type: "text" },
        { key: "categoryname", label: "Category", enableSorting: true, type: "text" },
        { key: "branchName", label: "Branch", enableSorting: true, type: "text" },
        { key: "status", label: "Status", enableSorting: true, type: "text" },
        { key: "isRegCompleted", label: "Reg. Completed", enableSorting: true, type: "checkbox" }
      ]}
      
      // Table configuration
      idKey="memberId"
      
      // UI customization
      title="Member Management"
      subtitle="Manage members with search, filter, and pagination."
      addButtonLabel="Add Member"
      
      // Routes
      addRoute="/dashboard/contributions/member-create"
      editRoute="/dashboard/contributions/member-edit"
      viewRoute="/dashboard/contributions/member-view"
      
      // Feature toggles
      showAddButton={true}
      showKiduPopupButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      
      // Pagination
      rowsPerPage={10}
    />
  );
};

export default MemberList;