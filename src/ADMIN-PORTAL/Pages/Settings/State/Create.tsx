import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import StateService from "../../../Services/Settings/State.services";
import KiduCreate from "../../../Components/KiduCreate";
import type { State } from "../../../Types/Settings/States.types";


const StateCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Define form fields with column widths matching State interface
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
        placeholder: "Enter abbreviation (e.g., KL, TN)",
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

  // Handle form submission
  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      // Transform form data to match State type
      const stateData: Omit<State, 'stateId' | 'auditLogs'> = {
        name: formData.name.trim(),
        abbreviation: formData.abbreviation.trim().toUpperCase(),
        isActive: Boolean(formData.isActive),
        circles: [], // Initialize empty array for circles
      };

      await StateService.createState(stateData);
      
    } catch (error: any) {
      console.error("Error creating state:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create New State"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create State"
      showResetButton={true}
      loadingState={isLoading}
      successMessage="State created successfully!"
      errorMessage="Failed to create state. Please try again."
      navigateOnSuccess="/dashboard/settings/state-list"
      navigateDelay={1500}
      themeColor="#1B3763"
    />
  );
};

export default StateCreate;