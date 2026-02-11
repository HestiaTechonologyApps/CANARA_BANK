import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import StateService from "../../../Services/Settings/State.services";
import KiduCreate from "../../../Components/KiduCreate";

const StateCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "State Name", required: true, colWidth: 6, placeholder: "e.g., Kerala"}},
    { name: "abbreviation", rules: { type: "text", label: "Abbreviation", required: true, colWidth: 6, maxLength: 10, placeholder: "e.g., KL"}},
    { name: "isActive", rules: { type: "toggle", label: "Active"}},
  ];
  const handleSubmit = async (formData: Record<string, any>) => {
    const payload = {
      stateId: 0,
      name: formData.name?.trim() || "",
      abbreviation: formData.abbreviation?.trim() || "",
      isActive: Boolean(formData.isActive),
      isDeleted: false
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