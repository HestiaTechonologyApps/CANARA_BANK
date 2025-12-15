import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { Status } from "../../../Types/Settings/Status";
import KiduEdit from "../../../Components/KiduEdit";
import StatusService from "../../../Services/Settings/StatusService";


const StatusEdit: React.FC = () => {
  // Define form fields matching StatusCreate
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
        placeholder: "Enter abbreviation",
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

  // Fetch status data by ID
  const handleFetch = async (statusId: string) => {
    try {
      const response = await StatusService.getStatusById(Number(statusId));
      return response;
    } catch (error: any) {
      console.error("Error fetching status:", error);
      throw error;
    }
  };

  // Handle form update
  const handleUpdate = async (statusId: string, formData: Record<string, any>) => {
    try {
      // Transform form data to match Status type
      const statusData: Omit<Status, 'statusId' | 'auditLogs'> = {
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim().toUpperCase(),
        description: formData.description?.trim() || "",
        groupId: Number(formData.groupId),
        isActive: Boolean(formData.isActive),
      };

      await StatusService.updateStatus(Number(statusId), statusData);
      
    } catch (error: any) {
      console.error("Error updating status:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit Status"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Status"
      showResetButton={true}
      successMessage="Status updated successfully!"
      errorMessage="Failed to update status. Please try again."
      paramName="statusId"
      navigateBackPath="/dashboard/settings/status-list"
      loadingText="Loading Status..."
      auditLogConfig={{
        tableName: "Status",
        recordIdField: "statusId"
      }}
      themeColor="#18575A"
    />
  );
};

export default StatusEdit;