import React from "react";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import { getFullImageUrl } from "../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../Assets/Images/profile.jpg";

const ManagingCommitteeList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA ================= */
      fetchService={async () => {
        const committees =
          await ManagingCommitteeService.getAllManagingCommittees();

        return committees.map((m: any) => ({
          ...m,

          // ✅ Convert imageLocation → profileImageSrc
          profileImageSrc: m.imageLocation
            ? getFullImageUrl(m.imageLocation)
            : defaultProfileImage,
        }));
      }}

      /* ================= COLUMNS ================= */
      columns={[
        { key: "managingComiteeId", label: "Committee ID", enableSorting: true, type: "text", },
        { key: "profileImageSrc", label: "Photo", enableSorting: false, type: "image", imageConfig: { width: 40, height: 40, isCircle: true, defaultImage: defaultProfileImage, }, },
        { key: "managingComitteeName", label: "Name", enableSorting: true, type: "text", },
        { key: "position", label: "Position", enableSorting: true, type: "text", },
        { key: "order", label: "Order", enableSorting: true, type: "text", },
      ]}

      /* ================= TABLE ================= */
      idKey="managingComiteeId"
      title="Managing Committee"
      subtitle="Manage managing committee with search and pagination."

      /* ================= ROUTES ================= */
      addButtonLabel="Add Committee"
      addRoute="/dashboard/cms/manage-committe-create"
      editRoute="/dashboard/cms/manage-committe-edit"
      viewRoute="/dashboard/cms/manage-committe-view"

      /* ================= FEATURES ================= */
      showAddButton
      showExport
      showSearch
      showActions

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default ManagingCommitteeList;
