import React from "react";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const YearMasterList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={YearMasterService.getAllYearMasters}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "yearOf", label: "Year", type: "text" },
        { key: "yearName", label: "Year Name", type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="yearOf"

      /* ================= UI ================= */
      title="Year Master"
      subtitle="Manage year with search, filter, and pagination."
      addButtonLabel="Add year"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/yearMaster-create"
      editRoute="/dashboard/settings/yearMaster-edit"
      viewRoute="/dashboard/settings/yearMaster-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default YearMasterList;
