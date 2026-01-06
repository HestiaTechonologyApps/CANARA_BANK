// src/ADMIN-PORTAL/Pages/Settings/Month/MonthCreate.tsx
import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import MonthService from "../../../Services/Settings/Month.services";
import KiduCreate from "../../../Components/KiduCreate";
import type { Month } from "../../../Types/Settings/Month.types";

const MonthCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "monthName", rules: { type: "text", label: "Month Name", required: true, colWidth: 6 } },
    { name: "abbrivation", rules: { type: "text", label: "Abbreviation", required: true, colWidth: 6 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Omit<Month, "monthCode" | "auditLogs"> = {
      monthName: formData.monthName.trim(),
      abbrivation: formData.abbrivation.trim(),
      monthId: 0
    };
    await MonthService.createMonth(payload);
  };

  return (
    <KiduCreate
      title="Create Month"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Month created successfully!"
      errorMessage="Failed to create month. Please try again."
      navigateOnSuccess="/dashboard/settings/month-list"
      themeColor="#1B3763"
    />
  );
};

export default MonthCreate;
