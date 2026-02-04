import React from "react";
import UserTypeService from "../../Services/Settings/UserType.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const UserTypeList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={UserTypeService.getAllUserTypes}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "userTypeId", label: "User Type ID", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: true, type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="userTypeId"

      /* ================= UI ================= */
      title="User Type Management"
      subtitle="Manage user types with search and pagination"
      addButtonLabel="Add User Type"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/usertype-create"
      editRoute="/dashboard/settings/usertype-edit"
      viewRoute="/dashboard/settings/usertype-view"

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

export default UserTypeList;
