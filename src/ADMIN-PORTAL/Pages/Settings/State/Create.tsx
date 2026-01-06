import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import StateService from "../../../Services/Settings/State.services";
import KiduCreate from "../../../Components/KiduCreate";
import type { State } from "../../../Types/Settings/States.types";

const StateCreate: React.FC = () => {

 const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "State Name", required: true, minLength: 2, maxLength: 50, placeholder: "Enter state name", colWidth: 6 } },
  { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 50, placeholder: "Enter abbreviation", colWidth: 3 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", required: false } }
];

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Omit<State, "stateId" | "auditLogs"> = {
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim(),
      isActive: Boolean(formData.isActive),
    };

    await StateService.createState(payload);
  };

  return (
    <KiduCreate
      title="Create State"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create State"
      showResetButton
      successMessage="State created successfully!"
      errorMessage="Failed to create state. Please try again."
      navigateOnSuccess="/dashboard/settings/state-list"
      navigateDelay={1200}
      themeColor="#1B3763"
    />
  );
};

export default StateCreate;
