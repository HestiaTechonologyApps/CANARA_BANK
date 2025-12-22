// src/ADMIN-PORTAL/Pages/Settings/Month/MonthEdit.tsx
import React from "react";
import type { Field } from "../../../Components/KiduEdit";
import MonthService from "../../../Services/Settings/Month.services";
import type { Month } from "../../../Types/Settings/Month.types";
import KiduEdit from "../../../Components/KiduEdit";

const MonthEdit: React.FC = () => {
  const fields: Field[] = [
    { 
      name: "monthCode", 
      rules: { 
        type: "number", 
        label: "Month Code", 
        disabled: true, 
        colWidth: 3 
      } 
    },
    { 
      name: "monthName", 
      rules: { 
        type: "text", 
        label: "Month Name", 
        required: true, 
        minLength: 2,
        maxLength: 10,
        colWidth: 6 
      } 
    },
    { 
      name: "abbrivation", 
      rules: { 
        type: "text", 
        label: "Abbreviation", 
        required: true,
        minLength: 1,
        maxLength: 50,
        colWidth: 3 
      } 
    },
  ];

  // ✅ Fetch by monthId
  const handleFetch = async (monthId: string) => {
    return await MonthService.getMonthById(Number(monthId));
  };

  // ✅ Update by monthId
  const handleUpdate = async (monthId: string, formData: Record<string, any>) => {
    const payload: Partial<Omit<Month, "monthId" | "auditLogs">> = {
      monthName: formData.monthName.trim(),
      abbrivation: formData.abbrivation.trim(),
    };

    await MonthService.updateMonth(Number(monthId), payload);
  };

  return (
    <KiduEdit
      title="Edit Month"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Month"
      successMessage="Month updated successfully!"
      errorMessage="Failed to update month."
      paramName="monthId"                       
      navigateBackPath="/dashboard/settings/month-list"
      auditLogConfig={{ 
        tableName: "Month", 
        recordIdField: "monthId"               
      }}
      themeColor="#18575A"
    />
  );
};

export default MonthEdit;
