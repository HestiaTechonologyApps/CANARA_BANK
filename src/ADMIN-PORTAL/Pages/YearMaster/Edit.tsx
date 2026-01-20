// src/components/YearMaster/YearMasterEdit.tsx
import React from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";

const YearMasterEdit: React.FC = () => {

  /* ================= FIELDS ================= */
  const fields: Field[] = [
    { name: "yearName", rules: { type: "select",  label: "Year Name", required: true, colWidth: 6, }, },
  ];

  /* ================= FETCH ================= */
  const handleFetch = async (yearOf: string) => {
    try {
      const response = await YearMasterService.getYearMasterById(Number(yearOf));
      return response; // ✅ REQUIRED for KiduEdit
    } catch (error: any) {
      console.error("Error fetching year master:", error);
      throw error;
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (yearOf: string, formData: Record<string, any>) => {
    try {
      const yearData: Omit<YearMaster, "auditLogs"> = {
        yearOf: Number(yearOf),
        yearName: Number(formData.yearName),
      };

      await YearMasterService.updateYearMaster(Number(yearOf), yearData);
      return true; // ✅ REQUIRED
    } catch (error: any) {
      console.error("Error updating year master:", error);
      throw error;
    }
  };
// Year Options
const yearOptions=[
  { value:2003, label:"2003"},
  { value:2004, label:"2004"},
  { value:2005, label:"2005"},
  { value:2006, label:"2006"},
  { value:2007, label:"2007"},
  { value:2008, label:"2008"},
  { value:2009, label:"2009"},
  { value:2010, label:"2010"},
  { value:2011, label:"2011"},
  { value:2012, label:"2012"},
  { value:2013, label:"2013"},
  { value:2014, label:"2014"},
  { value:2015, label:"2015"},
  { value:2016, label:"2016"},
  { value:2017, label:"2017"},
  { value:2018, label:"2018"},
  { value:2019, label:"2019"},
  { value:2020, label:"2020"},
  { value:2021, label:"2021"},
  { value:2022, label:"2022"},
  { value:2023, label:"2023"},
  { value:2024, label:"2024"},
  { value:2025, label:"2025"},
  { value:2026, label:"2026"},
  { value:2027, label:"2027"},
  { value:2028, label:"2028"},
  { value:2029, label:"2029"},
  { value:2030, label:"2030"},
]
  return (
    <KiduEdit
      title="Edit Year Master"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Year"
      showResetButton={true}
      successMessage="Year updated successfully!"
      errorMessage="Failed to update year. Please try again."
      paramName="yearOf"
      navigateBackPath="/dashboard/settings/yearMaster-list"
      loadingText="Loading Year..."
     // auditLogConfig={{ tableName: "YearMaster",recordIdField: "yearOf", }}
      themeColor="#1B3763"
       options={{
        yearName: yearOptions
      }}
    />
  );
};

export default YearMasterEdit;
