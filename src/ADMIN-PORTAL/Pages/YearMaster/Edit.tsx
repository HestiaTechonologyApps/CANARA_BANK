// src/components/YearMaster/YearMasterEdit.tsx
import React from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";

const YearMasterEdit: React.FC = () => {

  /* ================= FIELDS ================= */
  const fields: Field[] = [
    { name: "yearName", rules: { type: "number",  label: "Year Name", required: true, colWidth: 6, }, },
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

  return (
    <KiduEdit
      title="Edit Year"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Year"
      showResetButton={true}
      successMessage="Year updated successfully!"
      errorMessage="Failed to update year. Please try again."
      paramName="yearOf"
      themeColor="#1B3763"
      navigateBackPath="/dashboard/settings/yearMaster-list"
      loadingText="Loading Year..."
     // auditLogConfig={{ tableName: "YearMaster",recordIdField: "yearOf", }}
    />
  );
};

export default YearMasterEdit;
