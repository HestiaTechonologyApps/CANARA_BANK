// src/components/Company/CompanyView.tsx
import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import CompanyService from "../../../Services/Settings/Company.services";
import KiduView from "../../../Components/KiduView";

const fields: ViewField[] = [
  { key: "companyId", label: "Company ID", icon: "bi-hash" },
  { key: "comapanyName", label: "Company Name", icon: "bi-building" },
  { key: "website", label: "Website", icon: "bi-globe" },
  { key: "email", label: "Email", icon: "bi-envelope" },
  { key: "contactNumber", label: "Contact", icon: "bi-telephone" },
  { key: "taxNumber", label: "Tax Number", icon: "bi-receipt" },
  { key: "city", label: "City", icon: "bi-geo-alt" },
  { key: "state", label: "State", icon: "bi-flag" },
  { key: "country", label: "Country", icon: "bi-flag-fill" },
  { key: "isActive", label: "Active", icon: "bi-check-circle", isBoolean: true },
];

const CompanyView: React.FC = () => {
  const handleFetch = async (id: string) =>
    CompanyService.getCompanyById(Number(id));

  const handleDelete = async (id: string) =>
    CompanyService.deleteCompany(Number(id));

  return (
    <KiduView
      title="Company Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/company-edit"
      listRoute="/dashboard/settings/company-list"
      paramName="companyId"
      //auditLogConfig={{ tableName: "Company", recordIdField: "companyId" }}
      themeColor="#1B3763"
      loadingText="Loading category details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this company? This action cannot be undone."
    
    />
  );
};

export default CompanyView;
