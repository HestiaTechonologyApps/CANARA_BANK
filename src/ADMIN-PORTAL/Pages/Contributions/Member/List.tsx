import React from "react";
import MemberService from "../../../Services/Contributions/Member.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../../Assets/Images/profile.jpg";

const MemberList: React.FC = () => {
  return (
    <KiduServerTableList
       fetchService={async () => {  
    const response = await MemberService.getMembersPaginated({
      pageNumber: 1,
      pageSize: 99999, 
      searchTerm: "",
    });
    return response.data.map(member => ({
      ...member,
      profileImageSrc: member.profileImageSrc
        ? getFullImageUrl(member.profileImageSrc)
        : defaultProfileImage,
    }));
  }}
  transformData={(data) =>
    [...data].sort((a, b) => a.memberId - b.memberId)
  }

      columns={[
        { key: "memberId", label: "Member ID", enableSorting: true, type: "text" },
        { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" },
        { key: "profileImageSrc", label: "Photo", enableSorting: false, type: "image" },
        { key: "name", label: "Name", enableSorting: true, type: "text" },
        { key: "designationName", label: "Designation", enableSorting: true, type: "text" },
        { key: "categoryname", label: "Category", enableSorting: true, type: "text" },
        { key: "branchName", label: "Branch", enableSorting: true, type: "text" },
        { key: "status", label: "Status", enableSorting: true, type: "text" },
        { key: "isRegCompleted", label: "Reg. Completed", enableSorting: true, type: "checkbox" },
      ]}

      filterColumns={[  
        { key: "memberId", label: "Member ID", type: "text" },
        { key: "staffNo", label: "Staff No", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "categoryname", label: "Category", type: "text" },
        { key: "branchName", label: "Branch", type: "text" },
        { key: "status", label: "Status", type: "text" },
      ]}

      idKey="memberId"
      title="Member Management"
      subtitle="Manage members with search, filter, and pagination."
      addButtonLabel="Add New"
      addRoute="/dashboard/contributions/member-create"
      editRoute="/dashboard/contributions/member-edit"
      viewRoute="/dashboard/contributions/member-view"
      showAddButton={true}
      showKiduPopupButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showFilter={true}  
      rowsPerPage={10}
    />
  );
};

export default MemberList;