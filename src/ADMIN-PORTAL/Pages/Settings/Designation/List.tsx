import React from "react";
import DesignationService from "../../../Services/Settings/Designation.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const DesignationList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={DesignationService.getAllDesignations}

      columns={[
        { key: "designationId", label: "Designation ID", enableSorting: true, type: "text" },
        { key: "name", label: "Designation Name", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: false, type: "text" },
      ]}

      idKey="designationId"
      title="Designation Management"
      subtitle="Manage designations with search, filter, and pagination"
      addButtonLabel="Add Designation"
      addRoute="/dashboard/settings/designation-create"
      editRoute="/dashboard/settings/designation-edit"
      viewRoute="/dashboard/settings/designation-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default DesignationList;
