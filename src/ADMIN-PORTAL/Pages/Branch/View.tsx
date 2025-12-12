// src/components/Branch/BranchView.tsx
import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import BranchService from "../../Services/Settings/Branch.services";

const BranchView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "branchId", label: "Branch ID", icon: "bi-hash" },
    { key: "name", label: "Branch Name", icon: "bi-shop" },
    { key: "dpCode", label: "DP Code", icon: "bi-123" },

    { key: "address1", label: "Address Line 1", icon: "bi-geo-alt" },
    { key: "address2", label: "Address Line 2", icon: "bi-geo" },
    { key: "address3", label: "Address Line 3", icon: "bi-geo-fill" },
    { key: "district", label: "District", icon: "bi-geo-alt-fill" },

    { key: "circleId", label: "Circle ID", icon: "bi-diagram-3" },
    { key: "stateId", label: "State ID", icon: "bi-flag" },

    { key: "status", label: "Active", icon: "bi-check-circle", isBoolean: true },
    { key: "isRegCompleted", label: "Registration Completed", icon: "bi-clipboard-check", isBoolean: true },
  ];

  // Fetch branch by ID (service returns CustomResponse<Branch>)
  const handleFetch = async (branchId: string) => {
    const response = await BranchService.getBranchById(Number(branchId));
    return response; // KiduView expects the same shape as your UserView (CustomResponse)
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
      // No image for Branch; omit imageConfig
      auditLogConfig={{
        tableName: "Branch",
        recordIdField: "branchId",
      }}
      themeColor="#18575A"
      loadingText="Loading branch details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this branch? This action cannot be undone."
    />
  );
};

export default BranchView;
