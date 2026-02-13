import React from "react";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import { getFullImageUrl } from "../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../Assets/Images/profile.jpg";

const ManagingCommitteeList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => {
        const committees =
          await ManagingCommitteeService.getAllManagingCommittees();

        return committees.map((m: any) => ({
          ...m,
          profileImageSrc: m.imageLocation
            ? getFullImageUrl(m.imageLocation)
            : defaultProfileImage,
        }));
      }}

      columns={[
        { key: "managingComiteeId", label: "Committee ID", enableSorting: true, type: "text" },
        { key: "profileImageSrc", label: "Photo", enableSorting: false, type: "image" }, 
        { key: "managingComitteeName", label: "Name", enableSorting: true, type: "text" },
        { key: "position", label: "Position", enableSorting: true, type: "text" },
        { key: "order", label: "Order", enableSorting: true, type: "text" },
      ]}

      idKey="managingComiteeId"
      title="Managing Committee"
      subtitle="Manage managing committee with search and pagination."
      addButtonLabel="Add New"
      addRoute="/dashboard/cms/manage-committe-create"
      editRoute="/dashboard/cms/manage-committe-edit"
      viewRoute="/dashboard/cms/manage-committe-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default ManagingCommitteeList;
