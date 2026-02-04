import React from "react";
import UserRoleRightService from "../../../Services/Settings/UserRoleRight.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const UserRoleRightList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => await UserRoleRightService.getAllUserRoleRights()}
      columns={[
        { key: "userRoleRightId", label: "Role Right ID", enableSorting: true, type: "text" },
        { key: "controllerName", label: "Controller Name", enableSorting: true, type: "text" },
        { key: "actionName", label: "Action Name", enableSorting: true, type: "text" },
        { key: "userTypeID", label: "User Type ID", enableSorting: true, type: "text" },
      ]}
      idKey="userRoleRightId"
      title="User Role Right List"
      subtitle="Manage access control for user roles"
      addButtonLabel="Add Role Right"
      addRoute="/dashboard/settings/userroleright-create"
      editRoute="/dashboard/settings/userroleright-edit"
      viewRoute="/dashboard/settings/userroleright-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default UserRoleRightList;
