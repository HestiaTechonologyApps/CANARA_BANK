// src/ADMIN-PORTAL/Pages/Settings/Month/MonthEdit.tsx
import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import MonthService from "../../../Services/Settings/Month.services";
import type { Month } from "../../../Types/Settings/Month.types";
import KiduEdit from "../../../Components/KiduEdit";

const MonthEdit: React.FC = () => {
 const fields: Field[] = [
  //{ name: "monthCode", rules: { type: "number", label: "Month Code", disabled: true, colWidth: 3 } },
  { name: "monthName", rules: { type: "text", label: "Month Name", required: true, minLength: 2, maxLength: 10, colWidth: 6 } },
  { name: "abbrivation", rules: { type: "text", label: "Abbreviation", required: true, minLength: 1, maxLength: 50, colWidth: 3 } },
];

  const handleFetch = async (monthId: string) => {
    try {
      const response = await MonthService.getMonthById(Number(monthId));
      return response;
    } catch (error: any) {
      console.error("Error fetching month:", error);
      throw error;
    }
  };

  const handleUpdate = async (monthId: string, formData: Record<string, any>) => {
    try {
      const payload: Omit<Month, "auditLogs"> = {
        monthId: Number(monthId),         
        monthCode: formData.monthCode,     
        monthName: formData.monthName.trim(),
        abbrivation: formData.abbrivation.trim(),
      };

      await MonthService.updateMonth(Number(monthId), payload);
    } catch (error: any) {
      console.error("Error updating month:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit Month"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Month"
      showResetButton={true}               
      successMessage="Month updated successfully!"
      errorMessage="Failed to update month. Please try again."
      paramName="monthId"
      navigateBackPath="/dashboard/settings/month-list"
      loadingText="Loading Month..."       
      auditLogConfig={{
        tableName: "Month",
        recordIdField: "monthId",
      }}
      themeColor="#18575A"
    />
  );
};

export default MonthEdit;
