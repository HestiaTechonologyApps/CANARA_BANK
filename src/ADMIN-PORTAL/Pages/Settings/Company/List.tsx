import React from "react";
import type { Company } from "../../../Types/Settings/Company.types";
import CompanyService from "../../../Services/Settings/Company.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";
import defaultCompanyLogo from "../../../Assets/Images/profile.jpg";
import type { FilterColumn } from "../../../../Components/KiduTableFilter";


const COMPANY_COLUMNS = [
  { key: "companyId",     label: "Company ID",   enableSorting: true,  type: "text"     as const },
  { key: "companyLogo",   label: "Logo",         enableSorting: false, type: "image"    as const },
  { key: "comapanyName",  label: "Company Name", enableSorting: true,  type: "text"     as const },
  { key: "email",         label: "Email",                              type: "text"     as const },
  { key: "contactNumber", label: "Contact",                            type: "text"     as const },
  { key: "city",          label: "City",                               type: "text"     as const },
  { key: "state",         label: "State",                              type: "text"     as const },
  { key: "isActive",      label: "Active",                             type: "checkbox" as const },
];

const COMPANY_FILTER_COLUMNS: FilterColumn[] = [
  { key: "companyId",     label: "Company ID",   type: "text" },
  { key: "comapanyName",  label: "Company Name", type: "text" },
  { key: "email",         label: "Email",        type: "text" },
  { key: "contactNumber", label: "Contact",      type: "text" },
  { key: "city",          label: "City",         type: "text" },
  { key: "state",         label: "State",        type: "text" },
  { key: "isActive",      label: "Active",       type: "select", options: [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" }
  ] },
];

const transformCompanyData = (companies: Company[]) =>
  companies.map((company) => ({
    ...company,
    companyLogo: company.companyLogo
      ? getFullImageUrl(company.companyLogo)
      : defaultCompanyLogo,
  }));

const CompanyList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={CompanyService.getAllCompanies}
      transformData={transformCompanyData}
      columns={COMPANY_COLUMNS}
      filterColumns={COMPANY_FILTER_COLUMNS}
      idKey="companyId"
      title="Company Management"
      subtitle="Manage companies with search, filter, and pagination"
      addButtonLabel="Add New"
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