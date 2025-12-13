import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import StateService from "../../../Services/Settings/State.services";
import KiduView from "../../../Components/KiduView";


const StateView: React.FC = () => {
  // Define view fields
  const fields: ViewField[] = [
    { key: "stateId", label: "State ID", icon: "bi-hash" },
    { key: "name", label: "State Name", icon: "bi-geo-alt" },
    { key: "abbreviation", label: "Abbreviation", icon: "bi-tag" },
    { key: "isActive", label: "Is Active", icon: "bi-check-circle", isBoolean: true },
  ];

  // Fetch state data
  const handleFetch = async (stateId: string) => {
    const response = await StateService.getStateById(Number(stateId));
    return response;
  };

  // Delete state
  const handleDelete = async (stateId: string) => {
    await StateService.deleteState(Number(stateId));
  };

  return (
    <KiduView
      title="State Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/state-edit"
      listRoute="/dashboard/settings/state-list"
      paramName="stateId"
      auditLogConfig={{
        tableName: "State",
        recordIdField: "stateId",
      }}
      themeColor="#1B3763"
      loadingText="Loading state details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this state? This action cannot be undone."
    />
  );
};

export default StateView;