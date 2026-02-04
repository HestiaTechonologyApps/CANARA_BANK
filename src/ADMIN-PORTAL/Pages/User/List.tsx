import React from "react";
import UserService from "../../Services/Settings/User.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const UserList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={UserService.getAllUsers}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "userId", label: "User ID", enableSorting: true, type: "text" },
        { key: "userName", label: "User Name", enableSorting: true, type: "text" },
        { key: "staffNo", label: "Staff No", enableSorting: true, type: "text" },
        { key: "role", label: "Role", enableSorting: true, type: "text" },
        { key: "userEmail", label: "Email", enableSorting: true, type: "text" },
        { key: "phoneNumber", label: "Phone", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      /* ================= KEYS ================= */
      idKey="userId"

      /* ================= UI ================= */
      title="User Management"
      subtitle="Manage system users with search and pagination"
      addButtonLabel="Add User"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/user-create"
      editRoute="/dashboard/settings/user-edit"
      viewRoute="/dashboard/settings/user-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default UserList;
