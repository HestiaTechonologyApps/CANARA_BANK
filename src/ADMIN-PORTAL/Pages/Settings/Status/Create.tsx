import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { Status } from "../../../Types/Settings/Status.types";
import KiduCreate from "../../../Components/KiduCreate";
import StatusService from "../../../Services/Settings/Status.services";

const StatusCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "Status Name", required: true, minLength: 2, maxLength: 100, placeholder: "Enter status name", colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 100, placeholder: "Enter abbreviation (e.g., ACT, PEN)", colWidth: 6} },
    { name: "groupId",rules: { type: "select", label: "Group ID", required: true, placeholder: "Enter group ID", colWidth: 6} },
    { name: "description", rules: { type: "textarea", label: "Description", required: false, maxLength: 500, placeholder: "Enter status description", colWidth: 6 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {

      const statusData: Omit<Status, 'statusId' | 'auditLogs'> = {
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim().toUpperCase(),
        description: formData.description?.trim() || "",
        groupId: Number(formData.groupId),
        
      };

      await StatusService.createStatus(statusData);
      
    } catch (error: any) {
      console.error("Error creating status:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

//group id
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
      themeColor="#1B3763"
      options={{
        groupId: groupIdOptions
      }}
    />
  );
};

export default StatusCreate;