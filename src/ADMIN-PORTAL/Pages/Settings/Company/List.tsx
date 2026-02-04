import React from "react";
import CompanyService from "../../../Services/Settings/Company.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const CompanyList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={CompanyService.getAllCompanies}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "companyId", label: "Company ID", enableSorting: true, type: "text" },
        { key: "comapanyName", label: "Company Name", enableSorting: true, type: "text" },
        { key: "email", label: "Email", type: "text" },
        { key: "contactNumber", label: "Contact", type: "text" },
        { key: "city", label: "City", type: "text" },
        { key: "state", label: "State", type: "text" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}

      /* ================= KEYS ================= */
      idKey="companyId"

      /* ================= UI ================= */
      title="Company Management"
      subtitle="Manage companies with search, filter, and pagination"
      addButtonLabel="Add Company"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/settings/company-create"
      editRoute="/dashboard/settings/company-edit"
      viewRoute="/dashboard/settings/company-view"

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

export default CompanyList;
