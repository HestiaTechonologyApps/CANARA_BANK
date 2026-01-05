import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import type { Status } from "../../../Types/Settings/Status.types";
import KiduEdit from "../../../Components/KiduEdit";
import StatusService from "../../../Services/Settings/Status.services";


const StatusEdit: React.FC = () => {

  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "Status Name", required: true, minLength: 2,maxLength: 100, placeholder: "Enter status name", colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 100, placeholder: "Enter abbreviation", colWidth: 6 } },
    { name: "groupId", rules: { type: "number", label: "Group ID", required: true, placeholder: "Enter group ID", colWidth: 4} },
    { name: "description", rules: { type: "textarea", label: "Description", required: false, maxLength: 500, placeholder: "Enter status description", colWidth: 12 } }, 
  ];

  const handleFetch = async (statusId: string) => {
    try {
      const response = await StatusService.getStatusById(Number(statusId));
      return response;
    } catch (error: any) {
      console.error("Error fetching status:", error);
      throw error;
    }
  };

 const handleUpdate = async (statusId: string, formData: Record<string, any>) => {
  const payload: Omit<Status, 'auditLogs'> = {
    statusId: Number(statusId), 
    name: formData.name.trim(),
    abbreviation: formData.abbreviation.trim().toUpperCase(),
    description: formData.description?.trim() || "",
    groupId: Number(formData.groupId),
  };

  await StatusService.updateStatus(Number(statusId), payload);
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