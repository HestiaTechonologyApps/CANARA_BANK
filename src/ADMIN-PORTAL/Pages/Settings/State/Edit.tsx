import React from "react";
import StateService from "../../../Services/Settings/State.services";
import type { State } from "../../../Types/Settings/States.types";
import KiduEdit, { type Field } from "../../../Components/KiduEdit";


const StateEdit: React.FC = () => {
  // Define form fields matching StateCreate
  const fields: Field[] = [
    {
      name: "name",
      rules: {
        type: "text",
        label: "State Name",
        required: true,
        minLength: 2,
        maxLength: 100,
        placeholder: "Enter state name",
        colWidth: 6
      }
    },
    {
      name: "abbreviation",
      rules: {
        type: "text",
        label: "Abbreviation",
        required: true,
        minLength: 2,
        maxLength: 10,
        placeholder: "Enter abbreviation",
        colWidth: 6
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

  // Fetch state data by ID
  const handleFetch = async (stateId: string) => {
    console.log("🔍 StateEdit handleFetch called with:", stateId);
    try {
      const response = await StateService.getStateById(Number(stateId));
      console.log("📥 StateEdit response:", response);
      console.log("📥 Response.value:", response?.value);
      console.log("📥 Response.isSucess:", response?.isSucess);
      return response;
    } catch (error: any) {
      console.error("❌ Error fetching state:", error);
      throw error;
    }
  };

  // Handle form update
  const handleUpdate = async (stateId: string, formData: Record<string, any>) => {
    console.log("💾 StateEdit handleUpdate called with:", stateId, formData);
    try {
      // Transform form data to match State type
      const stateData: Partial<Omit<State, 'stateId' | 'auditLogs'>> = {
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim().toUpperCase(),
        isActive: Boolean(formData.isActive),
      };

      console.log("💾 Sending stateData:", stateData);
      await StateService.updateState(Number(stateId), stateData);
      console.log("✅ State updated successfully");
      
    } catch (error: any) {
      console.error("❌ Error updating state:", error);
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
      showResetButton={true}
      successMessage="State updated successfully!"
      errorMessage="Failed to update state. Please try again."
      paramName="stateId"
      navigateBackPath="/dashboard/settings/state-list"
      loadingText="Loading State..."
      auditLogConfig={{
        tableName: "State",
        recordIdField: "stateId"
      }}
      themeColor="#1B3763"
    />
  );
};

export default StateEdit;