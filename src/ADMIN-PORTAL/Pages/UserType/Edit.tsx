import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import UserTypeService from "../../Services/Settings/UserType.services";
import type { UserType } from "../../Types/Settings/UserType.types";

const UserTypeEdit: React.FC = () => {
  const fields: Field[] = [
   
    {
      name: "abbreviation",
      rules: {
        type: "text",
        label: "Abbreviation",
        required: true,
        minLength: 2,
        maxLength: 10,
        colWidth: 6,
      },
    },
    {
      name: "description",
      rules: {
        type: "text",
        label: "Description",
        required: true,
        minLength: 2,
        maxLength: 150,
        colWidth: 6,
      },
    },
  ];

  // Fetch a single UserType (service returns CustomResponse<UserType>)
  const handleFetch = async (id: string) => {
    const response = await UserTypeService.getUserTypeById(Number(id));
    return response;
  };

  // Update a UserType
  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Omit<UserType, "auditLogs"> = {
      userTypeId: Number(id),
      abbreviation: (formData.abbreviation || "").trim(),
      description: (formData.description || "").trim(),
    };

    if (!payload.abbreviation) throw new Error("Abbreviation is required.");
    if (!payload.description) throw new Error("Description is required.");

    await UserTypeService.updateUserType(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit User Type"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update User Type"
      showResetButton
      successMessage="User Type updated successfully!"
      errorMessage="Failed to update User Type. Please try again."
      paramName="userTypeId"
      navigateBackPath="/dashboard/settings/usertype-list"
      loadingText="Loading User Type..."
      auditLogConfig={{
        tableName: "UserType",
        recordIdField: "userTypeId",
      }}
      themeColor="#18575A"
    />
  );
};

export default UserTypeEdit;
