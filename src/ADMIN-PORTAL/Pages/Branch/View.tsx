
import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import BranchService from "../../Services/Settings/Branch.services";

const BranchView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "branchId", label: "Branch ID" },
    { key: "name", label: "Branch Name" },
    { key: "dpCode", label: "DP Code" },
    { key: "district", label: "District" },
    { key: "stateName", label: "State" },
    { key: "circleName", label: "Circle" },
    { key: "status", label: "Active" },
    { key: "isRegCompleted", label: "Registration Completed", isBoolean: true },
  ];

  return (
    <KiduView
      title="Branch Details"
      fields={fields}
      onFetch={(id) => BranchService.getBranchById(Number(id))}
      onDelete={(id) => BranchService.deleteBranch(Number(id))}
      editRoute="/dashboard/settings/branch-edit"
      listRoute="/dashboard/settings/branch-list"
      paramName="branchId"
      auditLogConfig={{ tableName: "Branch", recordIdField: "branchId" }}
      themeColor="#1B3763"
      showEditButton
      showDeleteButton
    />
  );
};

export default BranchView;
