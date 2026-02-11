import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import CompanyService from "../../../Services/Settings/Company.services";
import KiduView from "../../../Components/KiduView";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";
import defaultCompanyLogo from "../../../Assets/Images/profile.jpg";

const fields: ViewField[] = [
  { key: "companyId", label: "Company ID", icon: "bi-hash" },
  { key: "comapanyName", label: "Company Name", icon: "bi-building" },
  { key: "website", label: "Website", icon: "bi-globe" },
  { key: "email", label: "Email", icon: "bi-envelope" },
  { key: "contactNumber", label: "Contact Number", icon: "bi-telephone" },
  { key: "taxNumber", label: "Tax Number", icon: "bi-receipt" },
  { key: "invoicePrefix", label: "Invoice Prefix", icon: "bi-file-earmark-text" },
  { key: "addressLine1", label: "Address Line 1", icon: "bi-house-door" },
  { key: "addressLine2", label: "Address Line 2", icon: "bi-house" },
  { key: "city", label: "City", icon: "bi-geo-alt" },
  { key: "state", label: "State", icon: "bi-flag" },
  { key: "country", label: "Country", icon: "bi-flag-fill" },
  { key: "zipCode", label: "Zip Code", icon: "bi-mailbox" },
  { key: "isActive", label: "Active", icon: "bi-check-circle", isBoolean: true },
];

const CompanyView: React.FC = () => {

  const handleFetch = async (companyId: string) => {
    const response = await CompanyService.getCompanyById(Number(companyId));

    if (response.value) {
      response.value.companyLogo = response.value.companyLogo
        ? getFullImageUrl(response.value.companyLogo)
        : defaultCompanyLogo;
    }

    return response;
  };

  const handleDelete = async (companyId: string) => {
    await CompanyService.deleteCompany(Number(companyId));
  };

  return (
    <KiduView
      title="Company Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/company-edit"
      listRoute="/dashboard/settings/company-list"
      paramName="companyId"
      imageConfig={{ fieldName: "companyLogo", defaultImage: defaultCompanyLogo, showNameField: "comapanyName", showIdField: "companyId", isCircle: true, }}
      themeColor="#1B3763"
      loadingText="Loading company details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this company? This action cannot be undone."
    />
  );
};

export default CompanyView;
