// src/components/YearMaster/YearMasterCreate.tsx

import React, { useState } from "react";
import type { Field } from "../../Components/KiduCreate";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import KiduCreate from "../../Components/KiduCreate";


const YearMasterCreate: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const fields: Field[] = [
    { name: "yearOf", rules: { type: "number", label: "Year Of", required: true, colWidth: 4, }, },
    { name: "yearName", rules: { type: "number", label: "Year Name", placeholder: "e.g. 2024", required: true, colWidth: 4, },},
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setLoading(true);
    try {
      const payload: Omit<YearMaster, "auditLogs"> = {
        yearOf: Number(formData.yearOf),
        yearName: Number(formData.yearName),
      };

      await YearMasterService.createYearMaster(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Year Master"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Year"
      loadingState={loading}
      successMessage="Year created successfully!"
      errorMessage="Failed to create year"
      navigateOnSuccess="/dashboard/settings/year-master-list"
      themeColor="#1B3763"
    />
  );
};

export default YearMasterCreate;
