// src/components/YearMaster/YearMasterList.tsx
import React from "react";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "yearOf", label: "Year Of", type: "text" as const },
  { key: "yearName", label: "Year", type: "text" as const },
];

const YearMasterList: React.FC = () => {
  const fetchData = async () => {
    const data = await YearMasterService.getAllYearMasters();
    return { data, total: data.length };
  };

  return (
    <KiduServerTable
      title="Year Master"
      columns={columns}
      idKey="yearOf"
      addRoute="/dashboard/settings/yearMaster-create"
      editRoute="/dashboard/settings/yearMaster-edit"
      viewRoute="/dashboard/settings/yearMaster-view"
      fetchData={fetchData}
      showAddButton
      showSearch
      showActions
    />
  );
};

export default YearMasterList;
