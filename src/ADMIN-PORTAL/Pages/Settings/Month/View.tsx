// src/ADMIN-PORTAL/Pages/Settings/Month/MonthView.tsx
import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import MonthService from "../../../Services/Settings/Month.services";
import KiduView from "../../../Components/KiduView";

const MonthView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "monthId", label: "Month ID" },
    { key: "monthCode", label: "Month Code" },
    { key: "monthName", label: "Month Name" },
    { key: "abbrivation", label: "Abbreviation" },
  ];

  const handleFetch = async (monthId: string) => {
    const response = await MonthService.getMonthById(Number(monthId));
    return response;
  };

  const handleDelete = async (monthId: string) => {
    await MonthService.deleteMonth(Number(monthId));
  };

  return (
    <KiduView
      title="Month Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="monthId"                        
      editRoute="/dashboard/settings/month-edit"
      listRoute="/dashboard/settings/month-list"
      auditLogConfig={{
        tableName: "Month",
        recordIdField: "monthId",                
      }}
      themeColor="#18575A"
      loadingText="Loading month details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this month? This action cannot be undone."
    />
  );
};

export default MonthView;
