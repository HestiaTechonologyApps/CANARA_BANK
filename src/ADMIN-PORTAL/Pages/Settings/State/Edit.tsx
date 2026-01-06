import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import StateService from "../../../Services/Settings/State.services";
import KiduEdit from "../../../Components/KiduEdit";
import type { State } from "../../../Types/Settings/States.types";

const StateEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "State Name", required: true, minLength: 2, maxLength: 50, colWidth: 6 } },
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 50, colWidth: 3 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
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
    try {
      const stateData: Omit<State, "auditLogs"> = {
        stateId: Number(stateId),
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim(),
        isActive: Boolean(formData.isActive),
      };

      await StateService.updateState(Number(stateId), stateData);
    } catch (error: any) {
      console.error("Error updating state:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit State"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update State"
      successMessage="State updated successfully!"
      errorMessage="Failed to update state."
      paramName="stateId"
      navigateBackPath="/dashboard/settings/state-list"
      loadingText="Loading State..."
      auditLogConfig={{ tableName: "State", recordIdField: "stateId" }}
      themeColor="#1B3763"
    />
  );
};

export default StateEdit;
