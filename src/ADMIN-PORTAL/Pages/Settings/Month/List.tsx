import React from "react";
import MonthService from "../../../Services/Settings/Month.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const MonthList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={MonthService.getAllMonths}

      columns={[
        { key: "monthCode", label: "Month Code", enableSorting: true, type: "text" },
        { key: "monthName", label: "Month Name", enableSorting: true, type: "text" },
        { key: "abbrivation", label: "Abbreviation", enableSorting: true, type: "text" },
      ]}

      idKey="monthCode"
      title="Month List"
      subtitle="Manage months with search, sort, and pagination"
      addButtonLabel="Add Month"
      addRoute="/dashboard/settings/month-create"
      editRoute="/dashboard/settings/month-edit"
      viewRoute="/dashboard/settings/month-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default MonthList;
