import React from "react";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import KiduServerTable from "../../../Components/KiduServerTable";
import { getFullImageUrl } from "../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../Assets/Images/profile.jpg";

const columns = [
  { key: "managingComiteeId", label: "Committee ID", enableSorting: true, type: "text" as const },
  { key: "profileImageSrc", label: "Photo", enableSorting: false, type: "image" as const, imageConfig: { width: 40, height: 40, isCircle: true, defaultImage: defaultProfileImage, }, },
  { key: "managingComitteeName", label: "Name", enableSorting: true, type: "text" as const },
  { key: "position", label: "Position", enableSorting: true, type: "text" as const },
  { key: "order", label: "Order", enableSorting: true, type: "text" as const },
];

const ManagingCommitteeList: React.FC = () => {
  const fetchData = async (params: any) => {
    const committees = await ManagingCommitteeService.getAllManagingCommittees();

    const enriched = committees.map((m: any) => ({
      ...m,

      // ✅ Convert imageLocation → profileImageSrc (same as MemberList)
      profileImageSrc: m.imageLocation
        ? getFullImageUrl(m.imageLocation)
        : defaultProfileImage,
    }));
    // search + pagination
    const filtered = params.searchTerm
      ? enriched.filter(
          (m) =>
            m.managingComitteeName?.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
            m.position?.toLowerCase().includes(params.searchTerm.toLowerCase())
        )
      : enriched;

    return {
      data: filtered.slice(
        (params.pageNumber - 1) * params.pageSize,
        params.pageNumber * params.pageSize
      ),
      total: filtered.length,
    };
  };

  return (
    <KiduServerTable
      title="Managing Committee"
      subtitle="Manage managing committee with search and pagination."
      columns={columns}
      idKey="managingComiteeId"
      addButtonLabel="Add Committee"
      fetchData={fetchData}
      addRoute="/dashboard/cms/manage-committe-create"
      editRoute="/dashboard/cms/manage-committe-edit"
      viewRoute="/dashboard/cms/manage-committe-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default ManagingCommitteeList;
