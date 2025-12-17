// src/components/CMS/MainPage/MainPageList.tsx
import React from "react";
import type { MainPage } from "../../Types/CMS/MainPage.types";
import MainPageService from "../../Services/CMS/MainPage.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "mainPageId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "companyId", label: "Company ID", enableSorting: true, type: "text" as const },
  { key: "companyName", label: "Company Name", enableSorting: true, type: "text" as const },
  { key: "website", label: "Website", enableSorting: false, type: "text" as const },
  { key: "email", label: "Email", enableSorting: false, type: "text" as const },
  { key: "rulesRegulation", label: "Rules & Regulations", enableSorting: false, type: "text" as const },
  { key: "dayQuote", label: "Day Quote", enableSorting: false, type: "text" as const },
];

const MainPageList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: MainPage[]; total: number }> => {
    try {
      const mainPages = await MainPageService.getAllMainPages();

      let filteredMainPages = mainPages;

      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();

        filteredMainPages = mainPages.filter(
          (mainPage) =>
            mainPage.mainPageId?.toString().includes(params.searchTerm) ||
            mainPage.companyId?.toString().includes(params.searchTerm) ||
            mainPage.companyName?.toLowerCase().includes(searchLower) ||
            mainPage.website?.toLowerCase().includes(searchLower) ||
            mainPage.email?.toLowerCase().includes(searchLower)
        );
      }

      const startIndex = (params.pageNumber - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedMainPages = filteredMainPages.slice(startIndex, endIndex);

      return {
        data: paginatedMainPages,
        total: filteredMainPages.length,
      };
    } catch (error: any) {
      console.error("Error fetching main pages:", error);
      throw new Error(error.message || "Failed to fetch main pages");
    }
  };

  return (
    <KiduServerTable
      title="Main Page Management"
      subtitle="Manage main page details including images, contact info, and quotes"
      columns={columns}
      idKey="mainPageId"
      addButtonLabel="Add Main Page"
      addRoute="/dashboard/cms/mainpage-create"
      editRoute="/dashboard/cms/mainpage-edit"
      viewRoute="/dashboard/cms/mainpage-view"
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

export default MainPageList;
