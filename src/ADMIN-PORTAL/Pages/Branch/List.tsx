import React from "react";
import BranchService from "../../Services/Settings/Branch.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const BranchList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={BranchService.getAllBranches}

      columns={[
        { key: "branchId", label: "Branch ID", enableSorting: true, type: "text" },
        { key: "dpCode", label: "DP Code", enableSorting: true, type: "text" },
        { key: "name", label: "Branch Name", enableSorting: true, type: "text" },
        { key: "district", label: "District", enableSorting: true, type: "text" },
        { key: "stateName", label: "State", enableSorting: true, type: "text" },
        { key: "circleName", label: "Circle", enableSorting: true, type: "text" },
        { key: "status", label: "Status", enableSorting: true, type: "text" },
        { key:"isRegCompleted", label:"Reg Completed",enableSorting:true, type: "checkbox"}
      ]}

      filterColumns={[
            { key: "branchId", label: "Branch ID", type: "text" },
        { key: "dpCode", label: "DP Code", type: "text" },
        { key: "name", label: "Branch Name", type: "text" },
        { key: "district", label: "District", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "circleName", label: "Circle", type: "text" },
       { 
    key: "status", 
    label: "Status", 
    type: "select",                         
    options: [
      {value: "Active", label: "Active"},
      {value: "Inactive", label: "Inactive"},
    ]       
  },
   
      ]}
      
      idKey="branchId"
      title="Branch Management"
      subtitle="Manage branches with search, filter, and pagination."
      addButtonLabel="Add New"
      addRoute="/dashboard/settings/branch-create"
      editRoute="/dashboard/settings/branch-edit"
      viewRoute="/dashboard/settings/branch-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default BranchList;
