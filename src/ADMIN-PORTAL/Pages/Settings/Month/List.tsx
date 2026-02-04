import React from "react";
import MonthService from "../../../Services/Settings/Month.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const MonthList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={MonthService.getAllMonths}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "monthCode", label: "Month Code", enableSorting: true, type: "text" },
        { key: "monthName", label: "Month Name", enableSorting: true, type: "text" },
        { key: "abbrivation", label: "Abbreviation", enableSorting: true, type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="monthCode"

      /* ================= UI ================= */
      title="Month List"
      subtitle="Manage months with search, sort, and pagination"
      addButtonLabel="Add Month"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/month-create"
      editRoute="/dashboard/settings/month-edit"
      viewRoute="/dashboard/settings/month-view"

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

export default MonthList;
