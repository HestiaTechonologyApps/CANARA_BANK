// src/components/User/UserView.tsx
import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import UserService from "../../Services/Settings/User.services";
import defaultUserImage from "../../Assets/Images/profile.jpg";

const UserView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "userId", label: "User ID", icon: "bi-hash" },
    //{ key: "staffNo", label: "Staff No", icon: "bi-badge-ad" },
    { key: "userName", label: "User Name", icon: "bi-person" },
    { key: "userEmail", label: "Email", icon: "bi-envelope" },
    { key: "phoneNumber", label: "Phone Number", icon: "bi-telephone" },
    { key: "address", label: "Address", icon: "bi-geo-alt" },
    { key: "companyId", label: "Company ID", icon: "bi-building" },
    { key: "role", label: "Role", icon: "bi-person-badge" },
    { key: "createAt", label: "Created At", icon: "bi-calendar-plus", isDate: true },
    { key: "lastlogin", label: "Last Login", icon: "bi-clock-history", isDate: true },
    { key: "isActive", label: "Is Active", icon: "bi-check-circle", isBoolean: true },
    { key: "islocked", label: "Is Locked", icon: "bi-lock", isBoolean: true },
  ];

  const handleFetch = async (userId: string) => {
    const response = await UserService.getUserById(Number(userId));
    return response;
  };

  const handleDelete = async (userId: string) => {
    await UserService.deleteUser(Number(userId));
  };

  return (
    <KiduView
      title="User Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/user-edit"
      listRoute="/dashboard/settings/user-list"
      paramName="userId"
      imageConfig={{
        fieldName: "profileImage",
        defaultImage: defaultUserImage,
        showNameField: "userName",
        showIdField: "userId",
        isCircle: true,
      }}
      auditLogConfig={{
        tableName: "User",
        recordIdField: "userId",
      }}
      themeColor="#1B3763"
      loadingText="Loading user details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this user? This action cannot be undone."
    />
  );
};

export default UserView;
