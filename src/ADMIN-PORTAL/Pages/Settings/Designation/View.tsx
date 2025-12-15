// src/components/Designation/DesignationView.tsx
import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import DesignationService from "../../../Services/Settings/Designation.services";
import KiduView from "../../../Components/KiduView";

const DesignationView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "designationId", label: "Designation ID", icon: "bi-hash" },
    { key: "name", label: "Designation Name", icon: "bi-briefcase" },
    { key: "description", label: "Description", icon: "bi-file-text" }
  ];

  const handleFetch = async (designationId: string) => {
    const response = await DesignationService.getDesignationById(Number(designationId));
    return response;
  };

  const handleDelete = async (designationId: string) => {
    await DesignationService.deleteDesignation(Number(designationId));
  };

  return (
    <KiduView
      title="Designation Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/designation-edit"
      listRoute="/dashboard/settings/designation-list"
      paramName="designationId"
      auditLogConfig={{
        tableName: "Designation",
        recordIdField: "designationId",
      }}
      themeColor="#18575A"
      loadingText="Loading designation details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this designation? This action cannot be undone."
    />
  );
};

export default DesignationView;