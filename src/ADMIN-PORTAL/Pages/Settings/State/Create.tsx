import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import StateService from "../../../Services/Settings/State.services";
import KiduCreate from "../../../Components/KiduCreate";
import type { State } from "../../../Types/Settings/States.types";

const StateCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

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
        colWidth: 6,
      },
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
        colWidth: 3,
      },
    },
    {
      name: "isActive",
      rules: {
        type: "toggle",
        label: "Active",
        required: false,
      },
    },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const payload: Omit<State, "stateId" | "auditLogs"> = {
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim(),
        isActive: Boolean(formData.isActive),
      };

      await StateService.createState(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create State"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create State"
      showResetButton
      loadingState={isLoading}
      successMessage="State created successfully!"
      errorMessage="Failed to create state. Please try again."
      navigateOnSuccess="/dashboard/settings/state-list"
      navigateDelay={1200}
      themeColor="#18575A"
    />
  );
};

export default StateCreate;
