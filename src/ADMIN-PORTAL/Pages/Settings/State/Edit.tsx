import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import StateService from "../../../Services/Settings/State.services";
import KiduEdit from "../../../Components/KiduEdit";
import type { State } from "../../../Types/Settings/States.types";

const StateEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "State Name", required: true, minLength: 2, maxLength: 50, colWidth: 6, placeholder: "e.g., Kerala" }},
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 10, colWidth: 6, placeholder: "e.g., KL"}},
    { name: "isActive", rules: { type: "toggle", label: "Active" }},
  ];

  const handleFetch = async (stateId: string) => {
    try {
      const response = await StateService.getStateById(Number(stateId));
      return response;
    } catch (error: any) {
      console.error("Error fetching state:", error);
      throw error;
    }
  };

  const handleUpdate = async (stateId: string, formData: Record<string, any>) => {
    // ✅ Trim inputs before sending
    const stateData: Omit<State, "auditLogs"> = {
      stateId: Number(stateId),
      name: formData.name?.trim() || "",
      abbreviation: formData.abbreviation?.trim() || "",
      isActive: Boolean(formData.isActive),
    };

    // ✅ This will throw an error if duplicate exists
    await StateService.updateState(Number(stateId), stateData);
  };

  return (
    <KiduEdit
      title="Edit State"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update State"
      showResetButton
      successMessage="State updated successfully!"
      errorMessage="Failed to update state. Please try again" // ✅ This will be overridden by API error
      paramName="stateId"
      navigateBackPath="/dashboard/settings/state-list"
      loadingText="Loading State..."
      auditLogConfig={{ tableName: "State", recordIdField: "stateId" }}
      themeColor="#1B3763"
    />
  );
};

export default StateEdit;