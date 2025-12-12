import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchService from "../../Services/Settings/Branch.services";

const BranchCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    {
      name: "dpCode",
      rules: {
        type: "number",
        label: "DP Code",
        required: true,
        placeholder: "Enter DP code (e.g., 501)",
        colWidth: 4,
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
        placeholder: "Enter branch name (e.g., Gandhipuram Branch)",
        colWidth: 4,
      },
    },
    {
      name: "address1",
      rules: {
        type: "text",
        label: "Address Line 1",
        required: true,
        placeholder: "Enter address line 1",
        colWidth: 4,
      },
    },
    {
      name: "address2",
      rules: {
        type: "text",
        label: "Address Line 2",
        required: false,
        placeholder: "Enter address line 2",
        colWidth: 4,
      },
    },
    {
      name: "address3",
      rules: {
        type: "text",
        label: "Address Line 3",
        required: false,
        placeholder: "Enter address line 3",
        colWidth: 4,
      },
    },
    {
      name: "district",
      rules: {
        type: "text",
        label: "District",
        required: true,
        placeholder: "Enter district (e.g., Coimbatore)",
        colWidth: 4,
      },
    },
    {
      name: "circleId",
      rules: {
        type: "number",
        label: "Circle ID",
        required: true,
        placeholder: "Enter circle ID",
        colWidth: 4,
      },
    },
    {
      name: "stateId",
      rules: {
        type: "number",
        label: "State ID",
        required: true,
        placeholder: "Enter state ID",
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

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const payload: Omit<Branch, "branchId" | "auditLogs"> = {
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

      await BranchService.createBranch(payload);
    } catch (err) {
      console.error("Error creating branch:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Branch"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Branch"
      showResetButton
      loadingState={isLoading}
      successMessage="Branch created successfully!"
      errorMessage="Failed to create branch. Please check the details and try again."
      navigateOnSuccess="/dashboard/settings/branch-list"
      navigateDelay={1200}
      themeColor="#18575A"
    />
  );
};

export default BranchCreate;
