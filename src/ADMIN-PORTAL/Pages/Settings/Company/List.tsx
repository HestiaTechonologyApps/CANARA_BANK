import React from "react";
import CompanyService from "../../../Services/Settings/Company.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const CompanyList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={CompanyService.getAllCompanies}

      columns={[
        { key: "companyId", label: "Company ID", enableSorting: true, type: "text" },
        { key: "comapanyName", label: "Company Name", enableSorting: true, type: "text" },
        { key: "email", label: "Email", type: "text" },
        { key: "contactNumber", label: "Contact", type: "text" },
        { key: "city", label: "City", type: "text" },
        { key: "state", label: "State", type: "text" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ]}

      idKey="companyId"
      title="Company Management"
      subtitle="Manage companies with search, filter, and pagination"
      addButtonLabel="Add Company"
      addRoute="/dashboard/settings/company-create"
      editRoute="/dashboard/settings/company-edit"
      viewRoute="/dashboard/settings/company-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default CompanyList;
