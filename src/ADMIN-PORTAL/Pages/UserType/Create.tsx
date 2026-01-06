import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { UserType } from "../../Types/Settings/UserType.types";
import UserTypeService from "../../Services/Settings/UserType.services";


const UserTypeCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    { name: "abbreviation",rules: { type: "text", label: "Abbreviation", required: true, minLength: 2, maxLength: 50,placeholder: "e.g., STF", colWidth: 6,},},
    { name: "description",rules: { type: "text", label: "Description", required: true, minLength: 2, maxLength: 150, placeholder: "e.g., Staff User",colWidth: 6,},},
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const payload: Omit<UserType, "userTypeId" | "auditLogs"> = {
        abbreviation: (formData.abbreviation || "").trim(),
        description: (formData.description || "").trim(),
      };

      if (!payload.abbreviation) throw new Error("Abbreviation is required.");
      if (!payload.description) throw new Error("Description is required.");

      await UserTypeService.createUserType(payload);
    } catch (error) {
      console.error("Error creating User Type:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create User Type"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create User Type"
      showResetButton
      loadingState={isLoading}
      successMessage="User Type created successfully!"
      errorMessage="Failed to create User Type. Please check the details and try again."
      navigateOnSuccess="/dashboard/settings/usertype-list"
      navigateDelay={1200}
      themeColor="#1B3763"
    />
  );
};

export default UserTypeCreate;
