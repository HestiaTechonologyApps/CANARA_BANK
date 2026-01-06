// src/ADMIN-PORTAL/Pages/Settings/UserRoleRight/UserRoleRightCreate.tsx
import React from "react";
import KiduCreate from "../../../Components/KiduCreate";
import type { Field } from "../../../Components/KiduCreate";
import UserRoleRightService from "../../../Services/Settings/UserRoleRight.services";
import type { UserRoleRight } from "../../../Types/Settings/UserRoleRight.types";

const UserRoleRightCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "controllerName", rules: { type: "text", label: "Controller Name", required: true, colWidth: 6 } },
    { name: "actionName", rules: { type: "text", label: "Action Name", required: true, colWidth: 6 } },
    { name: "userTypeID", rules: { type: "number", label: "User Type ID", required: true, colWidth: 6 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    // Do NOT omit controllerNameString if you're sending it
    const payload: Omit<UserRoleRight, "userRoleRightId" | "auditLogs"> = {
      controllerName: formData.controllerName.trim(),
      controllerNameString: formData.controllerName.trim(), // keep if your API expects this mirror
      actionName: formData.actionName.trim(),
      userTypeID: Number(formData.userTypeID),
    };
    await UserRoleRightService.createUserRoleRight(payload);
  };

  return (
   <KiduCreate
  title="Create User Role Right"
  fields={fields}
  onSubmit={handleSubmit}
  successMessage="User Role Right created successfully!"
  errorMessage="Failed to create User Role Right. Please try again."
  navigateOnSuccess="/dashboard/settings/userroleright-list"
  themeColor="#1B3763"
/>

  );
};

export default UserRoleRightCreate;
