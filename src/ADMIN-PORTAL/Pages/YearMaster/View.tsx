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
      editRoute="/dashboard/settings/yearMaster-edit"
      listRoute="/dashboard/settings/yearMaster-list"
      paramName="yearOf"
      //auditLogConfig={{ tableName: "YearMaster", recordIdField: "yearOf", }}
      themeColor="#1B3763"
      deleteConfirmMessage="Are you sure you want to delete this year master? This action cannot be undone."
      showDeleteButton={true}
      showEditButton={true}
      loadingText="Loading year master details..."
    />
  );
};

export default YearMasterView;
