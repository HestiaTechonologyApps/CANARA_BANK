import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import KiduView from "../../../Components/KiduView";
import StatusService from "../../../Services/Settings/Status.services";

const StatusView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "statusId", label: "Status ID", icon: "bi-hash" },
    { key: "name", label: "Status Name", icon: "bi-tag" },
    {  key: "abbreviation",  label: "Abbreviation",  icon: "bi-bookmark", formatter: (value) => value?.toUpperCase() || "N/A" },
    { key: "description", label: "Description", icon: "bi-file-text" },
    { key: "groupId", label: "Group ID", icon: "bi-folder",formatter: (value) => value ? `Group ${value}` : "N/A" },
  ];

  const handleFetch = async (statusId: string) => {
    const response = await StatusService.getStatusById(Number(statusId));
    return response;
  };

  const handleDelete = async (statusId: string) => {
    await StatusService.deleteStatus(Number(statusId));
  };

  return (
    <KiduView
      title="Status Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/status-edit"
      listRoute="/dashboard/settings/status-list"
      paramName="statusId"
      auditLogConfig={{ tableName: "Status", recordIdField: "statusId", }}
      themeColor="#1B3763"
      loadingText="Loading status details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this status? This action cannot be undone."
    />
  );
};

export default StatusView;