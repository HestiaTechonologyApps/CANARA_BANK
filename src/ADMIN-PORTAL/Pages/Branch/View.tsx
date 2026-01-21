// src/components/Branch/BranchView.tsx

import React from "react";
import type { ViewField } from "../../Components/KiduView";
import KiduView from "../../Components/KiduView";
import BranchService from "../../Services/Settings/Branch.services";

const BranchView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "branchId", label: "Branch ID", icon: "bi-hash" },
    { key: "name", label: "Branch Name", icon: "bi-building" },
    { key: "dpCode", label: "DP Code", icon: "bi-upc-scan" },
    { key: "district", label: "District", icon: "bi-geo" },
    { key: "stateName", label: "State", icon: "bi-flag" },
    { key: "circleName", label: "Circle", icon: "bi-diagram-3" },
    { key: "status", label: "Active", icon: "bi-check-circle" },
    {
      key: "isRegCompleted",
      label: "Registration Completed",
      icon: "bi-shield-check",
      isBoolean: true,
    },
  ];

  const handleFetch = async (branchId: string) => {
    return await BranchService.getBranchById(Number(branchId));
  };

  const handleDelete = async (branchId: string) => {
    await BranchService.deleteBranch(Number(branchId));
  };

  return (
    <KiduView
      title="Branch Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/branch-edit"
      listRoute="/dashboard/settings/branch-list"
      paramName="branchId"
      auditLogConfig={{
        tableName: "Branch",
        recordIdField: "branchId",
      }}
      themeColor="#1B3763"
      loadingText="Loading branch details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this branch? This action cannot be undone."
    />
  );
};

export default BranchView;
