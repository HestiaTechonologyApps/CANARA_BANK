// src/components/Designation/DesignationCreate.tsx
import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { Designation } from "../../../Types/Settings/Designation";
import DesignationService from "../../../Services/Settings/Designation.services";
import KiduCreate from "../../../Components/KiduCreate";

const DesignationCreate: React.FC = () => {

 const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Designation Name", required: true, minLength: 2, maxLength: 100, placeholder: "Enter designation name", colWidth: 6 } },
  { name: "description", rules: { type: "textarea", label: "Description", required: false, maxLength: 500, placeholder: "Enter description", colWidth: 6 } }
];


  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      const designationData: Omit<Designation, "designationId" | "auditLogs"> = {
        name: formData.name.trim(),
        description: formData.description?.trim() || ""
      };

      await DesignationService.createDesignation(designationData);

    } catch (error: any) {
      console.error("Error creating designation:", error);
      throw error;
    }
  };

  return (
    <KiduCreate
      title="Create New Designation"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Designation"
      showResetButton={true}
      successMessage="Designation created successfully!"
      errorMessage="Failed to create designation. Please try again."
      navigateOnSuccess="/dashboard/settings/designation-list"
      navigateDelay={1500}
      themeColor="#18575A"
    />
  );
};

export default DesignationCreate;
