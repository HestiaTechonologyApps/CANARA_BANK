// src/components/CircleState/CircleStateView.tsx
import React from "react";
import KiduView from "../../../Components/KiduView";
import type { ViewField } from "../../../Components/KiduView";
import CircleStateService from "../../../Services/Settings/CircleState.services";

const fields: ViewField[] = [
  { key: "circleId", label: "Circle State ID", icon: "bi-diagram-3" },
  { key: "stateId", label: "State ID", icon: "bi-geo-alt" },

  { key: "createdByUserId", label: "Created By", icon: "bi-person" },
  { key: "createdDate", label: "Created Date", icon: "bi-calendar" },

  { key: "modifiedByUserId", label: "Modified By", icon: "bi-person-check" },
  { key: "modifiedDate", label: "Modified Date", icon: "bi-calendar-check" },
];

const CircleStateView: React.FC = () => {
  const handleFetch = async (id: string) =>
    CircleStateService.getCircleStateById(Number(id));

  const handleDelete = async (id: string) =>
    CircleStateService.deleteCircleState(Number(id));

  return (
    <KiduView
      title="Circle-State Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/circle-state-edit"
      listRoute="/dashboard/settings/circle-state-list"
      paramName="id"
      auditLogConfig={{
        tableName: "CircleState",
        recordIdField: "id",
      }}
      themeColor="#1B3763"
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this circle state? This action cannot be undone."
    />
  );
};

export default CircleStateView;
