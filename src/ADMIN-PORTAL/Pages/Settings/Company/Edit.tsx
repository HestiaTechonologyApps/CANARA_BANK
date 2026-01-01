// src/components/Company/CompanyEdit.tsx
import React from "react";
import KiduEdit from "../../../Components/KiduEdit";
import type { Field } from "../../../Components/KiduEdit";
import CompanyService from "../../../Services/Settings/Company.services";
import type { Company } from "../../../Types/Settings/Company.types";


const CompanyEdit: React.FC = () => {
  const fields: Field[] = [
    //{ name: "companyId", rules: { type: "number", label: "Company ID", disabled: true, colWidth: 3 } },
    { name: "comapanyName", rules: { type: "text", label: "Company Name", required: true, colWidth: 6 } },
    { name: "website", rules: { type: "text", label: "Website", required: true, colWidth: 6 } },

    { name: "contactNumber", rules: { type: "text", label: "Contact Number", required: true, colWidth: 4 } },
    { name: "email", rules: { type: "email", label: "Email", required: true, colWidth: 4 } },
    { name: "taxNumber", rules: { type: "text", label: "Tax Number", required: true, colWidth: 4 } },

    { name: "addressLine1", rules: { type: "text", label: "Address Line 1", required: true, colWidth: 6 } },
    { name: "addressLine2", rules: { type: "text", label: "Address Line 2", colWidth: 6 } },

    { name: "city", rules: { type: "text", label: "City", required: true, colWidth: 4 } },
    { name: "state", rules: { type: "text", label: "State", required: true, colWidth: 4 } },
    { name: "country", rules: { type: "text", label: "Country", required: true, colWidth: 4 } },

    { name: "zipCode", rules: { type: "text", label: "Zip Code", required: true, colWidth: 4 } },
    { name: "invoicePrefix", rules: { type: "text", label: "Invoice Prefix", required: true, colWidth: 4 } },

    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

  const handleFetch = async (companyId: string) =>
    CompanyService.getCompanyById(Number(companyId));

const handleUpdate = async (
  companyId: string,
  formData: Record<string, any>
) => {
  const payload: Omit<Company, "auditLogs"> = {
    companyId: Number(companyId),

    comapanyName: formData.comapanyName,
    website: formData.website,
    contactNumber: formData.contactNumber,
    email: formData.email,
    taxNumber: formData.taxNumber,

    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,

    city: formData.city,
    state: formData.state,
    country: formData.country,
    zipCode: formData.zipCode,

    invoicePrefix: formData.invoicePrefix,
    companyLogo: formData.companyLogo,

    isActive: Boolean(formData.isActive),
    isDeleted: false,
  };

  await CompanyService.updateCompany(Number(companyId), payload);
};


  return (
    <KiduEdit
      title="Edit Company"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      paramName="companyId"
      navigateBackPath="/dashboard/settings/company-list"
      successMessage="Company updated successfully!"
      errorMessage="Failed to update company"
      //auditLogConfig={{ tableName: "Company", recordIdField: "companyId" }}
      themeColor="#18575A"
    />
  );
};

export default CompanyEdit;
