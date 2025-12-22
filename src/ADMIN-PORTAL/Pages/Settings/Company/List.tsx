// src/components/Company/CompanyList.tsx
import React from "react";
import type { Company } from "../../../Types/Settings/Company.types";
import CompanyService from "../../../Services/Settings/Company.services";
import KiduServerTable from "../../../../Components/KiduServerTable";

const columns = [
  { key: "companyId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "comapanyName", label: "Company Name", enableSorting: true, type: "text" as const },
  { key: "email", label: "Email", type: "text" as const },
  { key: "contactNumber", label: "Contact", type: "text" as const },
  { key: "city", label: "City", type: "text" as const },
  { key: "state", label: "State", type: "text" as const },
  { key: "isActive", label: "Active", type: "checkbox" as const },
];

const CompanyList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Company[]; total: number }> => {
    try {
      const companies = await CompanyService.getAllCompanies();

      let filteredCompanies = companies;

      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();

        filteredCompanies = companies.filter(
          (company) =>
            company.comapanyName?.toLowerCase().includes(searchLower) ||
            company.email?.toLowerCase().includes(searchLower) ||
            company.contactNumber?.toLowerCase().includes(searchLower) ||
            company.city?.toLowerCase().includes(searchLower) ||
            company.state?.toLowerCase().includes(searchLower) ||
            company.companyId?.toString().includes(params.searchTerm)
        );
      }

      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;

      const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

      return {
        data: paginatedCompanies,
        total: filteredCompanies.length,
      };
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      throw new Error(error.message || "Failed to fetch companies");
    }
  };

  return (
    <KiduServerTable
      title="Company Management"
      subtitle="Manage companies with search, filter, and pagination"
      columns={columns}
      idKey="companyId"
      addButtonLabel="Add Company"
      addRoute="/dashboard/settings/company-create"
      editRoute="/dashboard/settings/company-edit"
      viewRoute="/dashboard/settings/company-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default CompanyList;
