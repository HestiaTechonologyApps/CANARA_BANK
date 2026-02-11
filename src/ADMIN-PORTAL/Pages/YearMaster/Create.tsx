import React from "react";
import type { Field } from "../../Components/KiduCreate";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import KiduCreate from "../../Components/KiduCreate";

const YearMasterCreate: React.FC = () => {
  const fields: Field[] = [
    { 
      name: "yearName", 
      rules: { 
        type: "number", 
        label: "Year", 
        placeholder: "e.g. 2024", 
        required: true, 
        colWidth: 6,
        minLength: 4,
        maxLength: 4
      }
    },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    // Validate year format
    const year = Number(formData.yearName);
    
    if (isNaN(year)) {
      throw new Error("Please enter a valid year");
    }
    
    if (year < 1900 || year > 2100) {
      throw new Error("Year must be between 1900 and 2100");
    }

    const yearData: Omit<YearMaster, "yearOf" | "auditLogs"> = {
      yearName: year,
    };
    
    // ✅ This will throw an error if duplicate or validation fails
    await YearMasterService.createYearMaster(yearData);
  };

  return (
    <KiduCreate
      title="Create Year"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Year"
      showResetButton
      successMessage="Year created successfully!"
      errorMessage="Failed to create year. Please try again."
      navigateOnSuccess="/dashboard/settings/yearMaster-list"
      themeColor="#1B3763"
    />
  );
};

export default YearMasterCreate;