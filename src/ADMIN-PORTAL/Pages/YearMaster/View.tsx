// src/components/YearMaster/YearMasterView.tsx

import React from "react";
import type { ViewField } from "../../Components/KiduView";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import KiduView from "../../Components/KiduView";


const fields: ViewField[] = [
  { key: "yearOf", label: "Year Of", icon: "bi-hash" },
  { key: "yearName", label: "Year", icon: "bi-calendar" },
];

const YearMasterView: React.FC = () => {
  const handleFetch = async (id: string) =>
    YearMasterService.getYearMasterById(Number(id));

  const handleDelete = async (id: string) =>
    YearMasterService.deleteYearMaster(Number(id));

  return (
    <KiduView
      title="Year Master Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/year-master-edit"
      listRoute="/dashboard/settings/year-master-list"
      paramName="yearOf"
      auditLogConfig={{
        tableName: "YearMaster",
        recordIdField: "yearOf",
      }}
      themeColor="#1B3763"
    />
  );
};

export default YearMasterView;
