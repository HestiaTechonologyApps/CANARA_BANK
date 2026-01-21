import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import UserTypeService from "../../Services/Settings/UserType.services";


const UserTypeView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "userTypeId", label: "User Type ID", icon: "bi-hash" },
    { key: "abbreviation", label: "Abbreviation", icon: "bi-tag" },
    { key: "description", label: "Description", icon: "bi-card-text" },
  ];

  const handleFetch = async (id: string) => {
    const response = await UserTypeService.getUserTypeById(Number(id));
    return response;
  };

  const handleDelete = async (id: string) => {
    await UserTypeService.deleteUserType(Number(id));
  };

  return (
    <KiduView
      title="User Type Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/usertype-edit"
      listRoute="/dashboard/settings/usertype-list"
      paramName="userTypeId"
      auditLogConfig={{
        tableName: "UserType",
        recordIdField: "userTypeId",
      }}
      themeColor="#1B3763"
      loadingText="Loading User Type details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this user type? This action cannot be undone."
    />
  );
};

export default UserTypeView;
