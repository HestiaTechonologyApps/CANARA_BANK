import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import type { Status } from "../../../Types/Settings/Status.types";
import KiduEdit from "../../../Components/KiduEdit";
import StatusService from "../../../Services/Settings/Status.services";


const StatusEdit: React.FC = () => {

  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "Status Name", required: true, minLength: 2,maxLength: 100, placeholder: "Enter status name", colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 100, placeholder: "Enter abbreviation", colWidth: 6 } },
    { name: "groupId", rules: { type: "select", label: "Group ID", required: true, placeholder: "Enter group ID", colWidth: 6} },
    { name: "description", rules: { type: "textarea", label: "Description", required: false, maxLength: 500, placeholder: "Enter status description", colWidth: 6 } }, 
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
//groupid
const groupIdOptions = [
  {value:1, label: "Group 1"},
  {value:2, label:"Group 2"},
  { value: 3, label: "Group 3" },
  { value: 4, label: "Group 4" },
  { value: 5, label: "Group 5" },
  { value: 6, label: "Group 6" },
  { value: 7, label: "Group 7" },
  { value: 8, label: "Group 8" },
  { value: 9, label: "Group 9" },
  { value: 10, label: "Group 10" }
]
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
      themeColor="#1B3763"
      options={{
        groupId: groupIdOptions
      }}
    />
  );
};

export default StatusEdit;