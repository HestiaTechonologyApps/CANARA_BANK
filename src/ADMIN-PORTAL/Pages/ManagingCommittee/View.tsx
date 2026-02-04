// src/components/CMS/ManagingCommittee/ManagingCommitteeView.tsx
import React from "react";
import type { ViewField } from "../../Components/KiduView";
import KiduView from "../../Components/KiduView";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import { getFullImageUrl } from "../../../CONSTANTS/API_ENDPOINTS";
import defaultProfileImage from "../../Assets/Images/profile.jpg";

const ManagingCommitteeView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "managingComiteeId", label: "Managing Committee ID", icon: "bi-hash" },
    { key: "managingComitteeName", label: "Name", icon: "bi-person-badge" },
    { key: "position", label: "Position", icon: "bi-award" },
    { key: "description1", label: "Description 1", icon: "bi-card-text" },
    { key: "description2", label: "Description 2", icon: "bi-card-text" },
    { key: "order", label: "Order", icon: "bi-list-ol" },
    { key: "companyId", label: "Company ID", icon: "bi-building" },
  ];

  const handleFetch = async (id: string) => {
    const response = await ManagingCommitteeService.getManagingCommitteeById(Number(id));

    if (response.value) {
      response.value.profileImageSrc = response.value.imageLocation
        ? getFullImageUrl(response.value.imageLocation)
        : defaultProfileImage;
    }

    return response;
  };

  const handleDelete = async (id: string) => {
    await ManagingCommitteeService.deleteManagingCommittee(Number(id));
  };

  return (
    <KiduView
      title="Managing Committee Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/cms/manage-committe-edit"
      listRoute="/dashboard/cms/manage-committe-list"
      paramName="managingComiteeId"
      imageConfig={{
        fieldName: "profileImageSrc",       
        defaultImage: defaultProfileImage,
        showNameField: "managingComitteeName",
        showIdField: "position",
        isCircle: true,
      }}
      themeColor="#1B3763"
      loadingText="Loading managing committee details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this committee? This action cannot be undone."
    />
  );
};

export default ManagingCommitteeView;
