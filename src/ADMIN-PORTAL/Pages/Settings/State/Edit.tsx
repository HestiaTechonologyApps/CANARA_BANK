import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import StateService from "../../../Services/Settings/State.services";
import KiduEdit from "../../../Components/KiduEdit";
import type { State } from "../../../Types/Settings/States.types";

const StateEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "stateId",
      rules: {
        type: "number",
        label: "State ID",
        disabled: true,
        colWidth: 3,
      },
    },
    {
      name: "name",
      rules: {
        type: "text",
        label: "State Name",
        required: true,
        minLength: 2,
        maxLength: 50,
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
        maxLength: 50,
        colWidth: 3,
      },
    },
    {
      name: "isActive",
      rules: {
        type: "toggle",
        label: "Active",
      },
    },
  ];

  const handleFetch = async (stateId: string) => {
    return await StateService.getStateById(Number(stateId));
  };

  const handleUpdate = async (stateId: string, formData: Record<string, any>) => {
    const payload: Partial<Omit<State, "stateId" | "auditLogs">> = {
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim(),
      isActive: Boolean(formData.isActive),
    };

    await StateService.updateState(Number(stateId), payload);
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
      auditLogConfig={{ tableName: "State", recordIdField: "stateId" }}
      themeColor="#18575A"
    />
  );
};

export default StateEdit;
