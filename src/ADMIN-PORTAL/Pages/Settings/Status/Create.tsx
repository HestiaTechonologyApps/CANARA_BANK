import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { Status } from "../../../Types/Settings/Status";
import StatusService from "../../../Services/Settings/StatusService";
import KiduCreate from "../../../Components/KiduCreate";

const StatusCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Define form fields matching Status interface
  const fields: Field[] = [
    {
      name: "name",
      rules: {
        type: "text",
        label: "Status Name",
        required: true,
        minLength: 2,
        maxLength: 100,
        placeholder: "Enter status name",
        colWidth: 6
      }
    },
    {
      name: "abbreviation",
      rules: {
        type: "text",
        label: "Abbreviation",
        required: true,
        minLength: 1,
        maxLength: 10,
        placeholder: "Enter abbreviation (e.g., ACT, PEN)",
        colWidth: 6
      }
    },
    {
      name: "groupId",
      rules: {
        type: "number",
        label: "Group ID",
        required: true,
        placeholder: "Enter group ID",
        colWidth: 4
      }
    },
    {
      name: "description",
      rules: {
        type: "textarea",
        label: "Description",
        required: false,
        maxLength: 500,
        placeholder: "Enter status description",
        colWidth: 12
      }
    },
    // Toggle field at the bottom
    {
      name: "isActive",
      rules: {
        type: "toggle",
        label: "Is Active",
        required: false
      }
    }
  ];

  // Handle form submission
  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      // Transform form data to match Status type
      const statusData: Omit<Status, 'statusId' | 'auditLogs'> = {
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim().toUpperCase(),
        description: formData.description?.trim() || "",
        groupId: Number(formData.groupId),
        isActive: Boolean(formData.isActive),
      };

      await StatusService.createStatus(statusData);
      
    } catch (error: any) {
      console.error("Error creating status:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create New Status"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Status"
      showResetButton={true}
      loadingState={isLoading}
      successMessage="Status created successfully!"
      errorMessage="Failed to create status. Please try again."
      navigateOnSuccess="/dashboard/settings/status-list"
      themeColor="#18575A"
    />
  );
};

export default StatusCreate;