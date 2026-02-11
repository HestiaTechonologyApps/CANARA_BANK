import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { Company } from "../../../Types/Settings/Company.types";
import CompanyService from "../../../Services/Settings/Company.services";
import KiduCreate from "../../../Components/KiduCreate";
import companyDefaultLogo from "../../../Assets/Images/profile.jpg";

const CompanyCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fields: Field[] = [
    { name: "comapanyName", rules: { type: "text", label: "Company Name", required: true, colWidth: 4 } },
    { name: "website", rules: { type: "text", label: "Website", required: true, colWidth: 4 } },
    { name: "contactNumber", rules: { type: "number", label: "Contact Number", required: true, colWidth: 4 } },
    { name: "email", rules: { type: "email", label: "Email", required: true, colWidth: 4 } },
    { name: "taxNumber", rules: { type: "text", label: "Tax Number", required: true, colWidth: 4 } },
    { name: "invoicePrefix", rules: { type: "text", label: "Invoice Prefix", required: true, colWidth: 4 } },
    { name: "addressLine1", rules: { type: "text", label: "Address Line 1", required: true, colWidth: 4 } },
    { name: "addressLine2", rules: { type: "text", label: "Address Line 2", colWidth: 4 } },
    { name: "city", rules: { type: "text", label: "City", required: true, colWidth: 4 } },
    { name: "state", rules: { type: "text", label: "State", required: true, colWidth: 4 } },
    { name: "country", rules: { type: "text", label: "Country", required: true, colWidth: 4 } },
    { name: "zipCode", rules: { type: "text", label: "Zip Code", required: true, colWidth: 4 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

 const handleSubmit = async (formData: Record<string, any>) => {
  setIsLoading(true);
  try {
    const payload: Omit<Company, "companyId" | "auditLogs"> = {
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
      companyLogo: "",
      isActive: Boolean(formData.isActive),
      isDeleted: false,
    };

    const createdCompany = await CompanyService.createCompany(payload);
    if (formData.companyLogo && createdCompany.companyId) {
      try {
        setIsUploading(true);
        await CompanyService.uploadCompanyLogo(
          formData.companyLogo,
          createdCompany.companyId
        );
      } catch (uploadError) {
        console.error("Company logo upload failed", uploadError);
      } finally {
        setIsUploading(false);
      }
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <KiduCreate
      title="Create Company"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Company"
      loadingState={isLoading || isUploading}
      showResetButton
      imageConfig={{ fieldName: "companyLogo", defaultImage: companyDefaultLogo, label: "Company Logo", }}
      navigateOnSuccess="/dashboard/settings/company-list"
      successMessage="Company created successfully!"
      errorMessage="Failed to create company. Please try again."
      themeColor="#1B3763"
    />
  );
};

export default CompanyCreate;
