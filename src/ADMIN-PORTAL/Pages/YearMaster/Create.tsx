import React from "react";
import type { Field } from "../../Components/KiduCreate";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import KiduCreate from "../../Components/KiduCreate";

const YearMasterCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "yearName", rules: { type: "number", label: "Year", placeholder: "e.g. 2024", required: true, colWidth: 4, },},
  ];

const handleSubmit = async (formData: Record<string, any>) => {
try{
  const yearData: Omit<YearMaster, "yearOf" | "auditLogs"> = {
    yearName: Number(formData.yearName),
  };
  await YearMasterService.createYearMaster(yearData);
} catch (error:any){
  console.error("Error creating year master:", error);
  throw error;
}
};

  return (
    <KiduCreate
      title="Create Year"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Year"
      showResetButton={true}
      successMessage="Year created successfully!"
      errorMessage="Failed to create year"
      navigateOnSuccess="/dashboard/settings/yearMaster-list"
      themeColor="#1B3763"
    />
  );
};

export default YearMasterCreate;
