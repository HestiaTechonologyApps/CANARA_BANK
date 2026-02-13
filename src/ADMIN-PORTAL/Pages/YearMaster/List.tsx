import React from "react";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const YearMasterList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={YearMasterService.getAllYearMasters}

      columns={[
        { key: "yearOf", label: "Year", type: "text" },
        { key: "yearName", label: "Year Name", type: "text" },
      ]}
      filterColumns={[
        { key: "yearOf", label: "Year", type: "text" },
        { key: "yearName", label: "Year Name", type: "text" },
      ]}

      idKey="yearOf"
      title="Year"
      subtitle="Manage year with search, filter, and pagination."
      addButtonLabel="Add year"
      addRoute="/dashboard/settings/yearMaster-create"
      editRoute="/dashboard/settings/yearMaster-edit"
      viewRoute="/dashboard/settings/yearMaster-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default YearMasterList;
