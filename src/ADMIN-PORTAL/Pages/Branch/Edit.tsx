import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchService from "../../Services/Settings/Branch.services";

const BranchEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "branchId",
      rules: {
        type: "number",
        label: "Branch ID",
        required: false,
        disabled: true,
        colWidth: 3,
      },
    },
    {
      name: "dpCode",
      rules: {
        type: "number",
        label: "DP Code",
        required: true,
        colWidth: 3,
      },
    },
    {
      name: "name",
      rules: {
        type: "text",
        label: "Branch Name",
        required: true,
        minLength: 2,
        maxLength: 150,
        colWidth: 6,
      },
    },
    {
      name: "address1",
      rules: {
        type: "text",
        label: "Address Line 1",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "address2",
      rules: {
        type: "text",
        label: "Address Line 2",
        required: false,
        colWidth: 4,
      },
    },
    {
      name: "address3",
      rules: {
        type: "text",
        label: "Address Line 3",
        required: false,
        colWidth: 4,
      },
    },
    {
      name: "district",
      rules: {
        type: "text",
        label: "District",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "circleId",
      rules: {
        type: "number",
        label: "Circle ID",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "stateId",
      rules: {
        type: "number",
        label: "State ID",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "status",
      rules: {
        type: "toggle",
        label: "Active",
        required: false,
      },
    },
    {
      name: "isRegCompleted",
      rules: {
        type: "toggle",
        label: "Registration Completed",
        required: false,
      },
    },
  ];

  // Fetch a branch by ID (service returns CustomResponse<Branch>)
  const handleFetch = async (branchId: string) => {
    try {
      const response = await BranchService.getBranchById(Number(branchId));
      return response; // KiduEdit expects your CustomResponse like in UserEdit
    } catch (error) {
      console.error("Error fetching branch:", error);
      throw error;
    }
  };

  // Update the branch
  const handleUpdate = async (branchId: string, formData: Record<string, any>) => {
    try {
      const payload: Omit<Branch, "auditLogs"> = {
        branchId: Number(branchId),
        dpCode: Number(formData.dpCode),
        name: formData.name?.trim() || "",
        address1: formData.address1?.trim() || "",
        address2: formData.address2?.trim() || "",
        address3: formData.address3?.trim() || "",
        district: formData.district?.trim() || "",
        status: Boolean(formData.status),
        circleId: Number(formData.circleId),
        stateId: Number(formData.stateId),
        isRegCompleted: Boolean(formData.isRegCompleted),
      };

      await BranchService.updateBranch(Number(branchId), payload);
    } catch (error) {
      console.error("Error updating branch:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit Branch"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Branch"
      showResetButton
      successMessage="Branch updated successfully!"
      errorMessage="Failed to update branch. Please try again."
      paramName="branchId"
      navigateBackPath="/dashboard/settings/branch-list"
      loadingText="Loading Branch..."
      auditLogConfig={{
        tableName: "Branch",
        recordIdField: "branchId",
      }}
      themeColor="#18575A"
    />
  );
};

export default BranchEdit;
