// src/components/YearMaster/YearMasterEdit.tsx

import React from "react";
import type { Field } from "../../Components/KiduCreate";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import KiduEdit from "../../Components/KiduEdit";


const YearMasterEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "yearOf",
      rules: {
        type: "number",
        label: "Year Of",
        // disabled: true,
        colWidth: 4,
      },
    },
    {
      name: "yearName",
      rules: {
        type: "number",
        label: "Year Name",
        required: true,
        colWidth: 4,
      },
    },
  ];

  const handleFetch = async (id: string) =>
    YearMasterService.getYearMasterById(Number(id));

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Partial<Omit<YearMaster, "auditLogs">> = {
      yearName: Number(formData.yearName),
    };

    await YearMasterService.updateYearMaster(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Year Master"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      paramName="yearOf"
      navigateBackPath="/dashboard/settings/year-master-list"
      successMessage="Year updated successfully!"
      errorMessage="Failed to update year"
      auditLogConfig={{
        tableName: "YearMaster",
        recordIdField: "yearOf",
      }}
      themeColor="#1B3763"
    />
  );
};

export default YearMasterEdit;
