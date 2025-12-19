import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import StateService from "../../../Services/Settings/State.services";
import KiduView from "../../../Components/KiduView";

const StateView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "stateId", label: "State ID" },
    { key: "name", label: "State Name" },
    { key: "abbreviation", label: "Abbreviation" },
    { key: "isActive", label: "Active" },
  ];

  const handleFetch = async (id: string) => {
    return await StateService.getStateById(Number(id));
  };

  const handleDelete = async (id: string) => {
    await StateService.deleteState(Number(id));
  };

  return (
    <KiduView
      title="State Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="stateId"
      editRoute="/dashboard/settings/state-edit"
      listRoute="/dashboard/settings/state-list"
      auditLogConfig={{ tableName: "State", recordIdField: "stateId" }}
      showEditButton
      showDeleteButton
      deleteConfirmMessage="Are you sure you want to delete this state?"
      themeColor="#18575A"
    />
  );
};

export default StateView;
