import React from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";

const YearMasterEdit: React.FC = () => {
  const fields: Field[] = [
    { 
      name: "yearName", 
      rules: { 
        type: "number", 
        label: "Year", 
        required: true, 
        colWidth: 6,
        placeholder: "e.g. 2024"
      }
    },
  ];

  const handleFetch = async (yearOf: string) => {
    try {
      const response = await YearMasterService.getYearMasterById(Number(yearOf));
      return response;
    } catch (error: any) {
      console.error("Error fetching year master:", error);
      throw error;
    }
  };

  const handleUpdate = async (yearOf: string, formData: Record<string, any>) => {
    // Validate year format
    const year = Number(formData.yearName);
    
    if (isNaN(year)) {
      throw new Error("Please enter a valid year");
    }
    
    if (year < 1900 || year > 2100) {
      throw new Error("Year must be between 1900 and 2100");
    }

    const yearData: Omit<YearMaster, "auditLogs"> = {
      yearOf: Number(yearOf),
      yearName: year,
    };

    // ✅ This will throw an error if duplicate or validation fails
    await YearMasterService.updateYearMaster(Number(yearOf), yearData);
  };

  return (
    <KiduEdit
      title="Edit Year"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Year"
      showResetButton
      successMessage="Year updated successfully!"
      errorMessage="Failed to update year. Please try again."
      paramName="yearOf"
      themeColor="#1B3763"
      navigateBackPath="/dashboard/settings/yearMaster-list"
      loadingText="Loading Year..."
      auditLogConfig={{ 
        tableName: "YearMaster",
        recordIdField: "yearOf" 
      }}
    />
  );
};

export default YearMasterEdit;