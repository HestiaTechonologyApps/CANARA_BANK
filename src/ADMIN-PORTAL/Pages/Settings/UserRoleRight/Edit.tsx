import React from "react";
import KiduEdit from "../../../Components/KiduEdit";
import type { Field } from "../../../Components/KiduEdit";
import UserRoleRightService from "../../../Services/Settings/UserRoleRight.services";
import type { UserRoleRight } from "../../../Types/Settings/UserRoleRight.types";

const UserRoleRightEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "userRoleRightId", rules: { type: "number", label: "Role Right ID", required: false, disabled: true, colWidth: 4 } },
    { name: "controllerName", rules: { type: "text", label: "Controller Name", required: true, colWidth: 4 } },
    { name: "actionName", rules: { type: "text", label: "Action Name", required: true, colWidth: 4 } },
    { name: "userTypeID", rules: { type: "number", label: "User Type ID", required: true, colWidth: 4 } },
  ];

  const handleFetch = async (id: string) => {
    const response = await UserRoleRightService.getUserRoleRightById(Number(id));
    return response;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Omit<UserRoleRight, "auditLogs"> = {
      userRoleRightId: Number(id),
      controllerName: formData.controllerName.trim(),
      controllerNameString: formData.controllerName.trim(),
      actionName: formData.actionName.trim(),
      userTypeID: Number(formData.userTypeID),
    };
    await UserRoleRightService.updateUserRoleRight(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit User Role Right"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Role Right"
      showResetButton
      successMessage="User Role Right updated successfully!"
      errorMessage="Failed to update User Role Right. Please try again."
      paramName="userRoleRightId"
      navigateBackPath="/dashboard/settings/userroleright-list"
      loadingText="Loading Role Right..."
      auditLogConfig={{ tableName: "UserRoleRight", recordIdField: "userRoleRightId" }}
      themeColor="#1B3763"
    />
  );
};

export default UserRoleRightEdit;
