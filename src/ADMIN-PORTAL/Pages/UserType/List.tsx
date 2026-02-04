import React from "react";
import UserTypeService from "../../Services/Settings/UserType.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const UserTypeList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={UserTypeService.getAllUserTypes}

      columns={[
        { key: "userTypeId", label: "User Type ID", enableSorting: true, type: "text" },
        { key: "abbreviation", label: "Abbreviation", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: true, type: "text" },
      ]}

      idKey="userTypeId"
      title="User Type Management"
      subtitle="Manage user types with search and pagination"
      addButtonLabel="Add User Type"
      addRoute="/dashboard/settings/usertype-create"
      editRoute="/dashboard/settings/usertype-edit"
      viewRoute="/dashboard/settings/usertype-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default UserTypeList;
