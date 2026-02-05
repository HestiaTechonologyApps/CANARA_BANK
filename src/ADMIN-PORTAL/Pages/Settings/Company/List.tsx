import React from "react";
import type { Company } from "../../../Types/Settings/Company.types";
import CompanyService from "../../../Services/Settings/Company.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";
import { getFullImageUrl } from "../../../../CONSTANTS/API_ENDPOINTS";
import defaultCompanyLogo from "../../../Assets/Images/profile.jpg";

const CompanyList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={CompanyService.getAllCompanies}

      transformData={(companies: Company[]) => {
        console.log("=== TRANSFORM DATA DEBUG ===");
        console.log("Raw companies data:", companies);
        
        const transformed = companies.map(company => {
          const originalLogo = company.companyLogo;
          const transformedLogo = company.companyLogo
            ? getFullImageUrl(company.companyLogo)
            : defaultCompanyLogo;
          
          console.log("Company ID:", company.companyId);
          console.log("Original logo:", originalLogo);
          console.log("Transformed logo:", transformedLogo);
          console.log("---");
          
          return {
            ...company,
            companyLogo: transformedLogo,
          };
        });
        
        console.log("Final transformed data:", transformed);
        console.log("=== END DEBUG ===");
        
        return transformed;
      }}

      columns={[
        { key: "companyId", label: "Company ID", enableSorting: true, type: "text" },
        { key: "companyLogo", label: "Logo", enableSorting: false, type: "image" },
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
