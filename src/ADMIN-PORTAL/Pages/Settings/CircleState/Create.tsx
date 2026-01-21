// src/components/CircleState/CircleStateCreate.tsx
import React, { useState } from "react";
import KiduCreate from "../../../Components/KiduCreate";
import type { Field } from "../../../Components/KiduCreate";
import CircleStateService from "../../../Services/Settings/CircleState.services";
import type { CircleState } from "../../../Types/Settings/CircleState.types";

const CircleStateCreate: React.FC = () => {
  
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    { name: "circleId",rules: { type: "number", label: "Circle ID", required: true, colWidth: 4 }, },
    { name: "stateId", rules: { type: "number", label: "State ID", required: true, colWidth: 4 },},
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const payload: Omit<CircleState, "auditLogs"> = {
        circleId: Number(formData.circleId),
        stateId: Number(formData.stateId),
        createdByUserId: 0,
        createdDate: new Date().toISOString(),
        modifiedByUserId: 0,
        modifiedDate: new Date().toISOString(),
      };

      await CircleStateService.createCircleState(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Circle-State"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Circle state"
      showResetButton
      loadingState={isLoading}
      successMessage="Circle-State created successfully!"
      errorMessage="Failed to create circle state. Please try again."
      navigateOnSuccess="/dashboard/settings/circle-state-list"
      themeColor="#1B3763"
    />
  );
};

export default CircleStateCreate;
