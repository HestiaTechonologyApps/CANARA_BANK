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
    const response =  await StateService.getStateById(Number(id));
    return response;
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
      auditLogConfig={{  tableName: "State", recordIdField: "stateId" }}
      showEditButton={true}
      showDeleteButton={true}
      loadingText="Loading month details..."
      deleteConfirmMessage="Are you sure you want to delete this state? This action cannot be undone."
      themeColor="#1B3763"
    />
  );
};

export default StateView;
