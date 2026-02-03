// src/components/CMS/ManagingCommittee/ManagingCommitteeView.tsx
import React from "react";
import type { ViewField } from "../../Components/KiduView";
import KiduView from "../../Components/KiduView";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";

const ManagingCommitteeView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "managingComiteeId", label: "Managing Comitee ID", icon: "bi-hash" },
    { key: "managingComitteeName", label: "Name", icon: "bi-person-badge" },
    { key: "position", label: "Position", icon: "bi-award" },
    { key: "description1", label: "Description 1", icon: "bi-card-text" },
    { key: "description2", label: "Description 2", icon: "bi-card-text" },
    { key: "imageLocation", label: "Image", icon: "bi-image" },
    { key: "order", label: "Order", icon: "bi-list-ol" },
    { key: "companyId", label: "Company ID", icon: "bi-building" },
  ];

  const handleFetch = async (id: string) => {
    return await ManagingCommitteeService.getManagingCommitteeById(Number(id));
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
      //auditLogConfig={{ tableName: "ManagingCommittee", recordIdField: "managingComiteeId",}}
      themeColor="#1B3763"
      loadingText="Loading managing committee details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this committee? This action cannot be undone."
    />
  );
};

export default ManagingCommitteeView;
