// src/components/CircleState/CircleStateEdit.tsx
import React from "react";
import KiduEdit from "../../../Components/KiduEdit";
import type { Field } from "../../../Components/KiduEdit";
import CircleStateService from "../../../Services/Settings/CircleState.services";
import type { CircleState } from "../../../Types/Settings/CircleState.types";

const CircleStateEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "circleId", rules: { type: "number", label: "Circle ID", required: true, colWidth: 6 }, },
    { name: "stateId", rules: { type: "number", label: "State ID", required: true, colWidth: 6 }, },
  ];

  const handleFetch = async (id: string) =>
    CircleStateService.getCircleStateById(Number(id));

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Partial<Omit<CircleState, "auditLogs">> = {
      circleId: Number(formData.circleId),
      stateId: Number(formData.stateId),
      modifiedByUserId: 0,
      modifiedDate: new Date().toISOString(),
    };

    await CircleStateService.updateCircleState(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Circle-State Mapping"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      paramName="id"
      navigateBackPath="/dashboard/settings/circle-state-list"
      successMessage="Mapping updated successfully!"
      errorMessage="Failed to update mapping"
      auditLogConfig={{
        tableName: "CircleState",
        recordIdField: "id",
      }}
      themeColor="#1B3763"
    />
  );
};

export default CircleStateEdit;
