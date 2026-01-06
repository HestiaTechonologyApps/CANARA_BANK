// src/components/Designation/DesignationEdit.tsx
import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import DesignationService from "../../../Services/Settings/Designation.services";
import type { Designation } from "../../../Types/Settings/Designation";
import KiduEdit from "../../../Components/KiduEdit";

const DesignationEdit: React.FC = () => {

  const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Designation Name", required: true, minLength: 2, maxLength: 100, placeholder: "Enter designation name", colWidth: 12 } },
  { name: "description", rules: { type: "textarea", label: "Description", required: false, maxLength: 500, placeholder: "Enter description", colWidth: 12 } }
];

  const handleFetch = async (designationId: string) => {
    try {
      const response = await DesignationService.getDesignationById(Number(designationId));
      return response;
    } catch (error: any) {
      console.error("Error fetching designation:", error);
      throw error;
    }
  };

  const handleUpdate = async (designationId: string, formData: Record<string, any>) => {
    try {
      const designationData: Omit<Designation, 'auditLogs'> = {
        designationId: Number(designationId),
        name: formData.name.trim(),
        description: formData.description?.trim() || ""
      };

      await DesignationService.updateDesignation(Number(designationId), designationData);
      
    } catch (error: any) {
      console.error("Error updating designation:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit Designation"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Designation"
      showResetButton={true}
      successMessage="Designation updated successfully!"
      errorMessage="Failed to update designation. Please try again."
      paramName="designationId"
      navigateBackPath="/dashboard/settings/designation-list"
      loadingText="Loading Designation..."
      auditLogConfig={{
        tableName: "Designation",
        recordIdField: "designationId"
      }}
      themeColor="#1B3763"
    />
  );
};

export default DesignationEdit;