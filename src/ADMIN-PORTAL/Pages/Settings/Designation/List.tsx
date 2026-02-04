import React from "react";
import DesignationService from "../../../Services/Settings/Designation.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const DesignationList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={DesignationService.getAllDesignations}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "designationId", label: "Designation ID", enableSorting: true, type: "text" },
        { key: "name", label: "Designation Name", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: false, type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="designationId"

      /* ================= UI ================= */
      title="Designation Management"
      subtitle="Manage designations with search, filter, and pagination"
      addButtonLabel="Add Designation"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/designation-create"
      editRoute="/dashboard/settings/designation-edit"
      viewRoute="/dashboard/settings/designation-view"

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

export default DesignationList;
