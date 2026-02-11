import React from "react";
import KiduView from "../../../Components/KiduView";
import UserRoleRightService from "../../../Services/Settings/UserRoleRight.services";
import type { ViewField } from "../../../Components/KiduView";

const UserRoleRightView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "userRoleRightId", label: "Role Right ID", icon: "bi-key" },
    { key: "controllerName", label: "Controller Name", icon: "bi-diagram-3" },
    { key: "actionName", label: "Action Name", icon: "bi-gear" },
    { key: "userTypeID", label: "User Type ID", icon: "bi-person-badge" },
  ];

  const handleFetch = async (id: string) => {
    const response = await UserRoleRightService.getUserRoleRightById(Number(id));
    return response;
  };

  const handleDelete = async (id: string) => {
    await UserRoleRightService.deleteUserRoleRight(Number(id));
  };

  return (
    <KiduView
      title="User Role Right Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="userRoleRightId"
      listRoute="/dashboard/settings/userroleright-list"
      auditLogConfig={{ tableName: "UserRoleRight", recordIdField: "userRoleRightId" }}
      themeColor="#1B3763"
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this role right? This action cannot be undone."
    />
  );
};

export default UserRoleRightView;
