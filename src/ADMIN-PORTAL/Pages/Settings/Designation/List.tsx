// DesignationList.tsx
import React from "react";
import DesignationService from "../../../Services/Settings/Designation.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const DesignationList: React.FC = () => {
  return (
    <KiduServerTableList
      // Use the paginated service instead of fetchService
      //paginatedFetchService={DesignationService.getPagedDesignations}
fetchService={async () => {   
        const data = await DesignationService.getAllDesignations();
        return data;
      }}
      columns={[
        { key: "designationId", label: "Designation ID", enableSorting: true, type: "text" },
        { key: "name", label: "Designation Name", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: true, type: "text" },
      ]}
filterColumns={[  
        { key: "designationId", label: "Designation ID", type: "text" },
        { key: "name", label: "Designation Name", type: "text" },
        { key: "description", label: "Description", type: "text" },
      ]}
      idKey="designationId"
      title="Designation Management"
      subtitle="Manage designations with search, filter, and pagination"
      addButtonLabel="Add New"
      addRoute="/dashboard/settings/designation-create"
      editRoute="/dashboard/settings/designation-edit"
      viewRoute="/dashboard/settings/designation-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showFilter={true}
      rowsPerPage={10}
    />
  );
};

export default DesignationList;