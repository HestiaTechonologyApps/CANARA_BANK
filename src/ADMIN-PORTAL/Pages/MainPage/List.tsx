// src/components/CMS/MainPage/MainPageList.tsx

import React from "react";
import type { MainPage } from "../../Types/CMS/MainPage.types";
import type { Company } from "../../Types/Settings/Company.types";

import MainPageService from "../../Services/CMS/MainPage.services";
import CompanyService from "../../Services/Settings/Company.services";

import KiduServerTable from "../../../Components/KiduServerTable";

/* ===================== TABLE COLUMNS ===================== */
const columns = [
  { key: "mainPageId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "companyName", label: "Company", enableSorting: true, type: "text" as const },
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
  }): Promise<{ data: any[]; total: number }> => {
    try {
      /* ===================== FETCH DATA ===================== */
      const [mainPages, companies] = await Promise.all([
        MainPageService.getAllMainPages(),
        CompanyService.getAllCompanies(),
      ]);

      /* ===================== LOOKUP MAP ===================== */
      const companyMap = Object.fromEntries(
        companies.map((c: Company) => [c.companyId, c.comapanyName])
      );

      /* ===================== ENRICH MAIN PAGES ===================== */
      let enrichedMainPages = mainPages.map((m: MainPage) => ({
        ...m,
        companyName: companyMap[m.companyId] ?? "-",
      }));

      /* ===================== SEARCH ===================== */
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();

        enrichedMainPages = enrichedMainPages.filter((m) =>
          [
            m.mainPageId,
            m.companyName,
            m.website,
            m.email,
            m.rulesRegulation,
            m.dayQuote,
          ]
            .map(String)
            .some((v) => v.toLowerCase().includes(q))
        );
      }

      /* ===================== PAGINATION ===================== */
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: enrichedMainPages.slice(start, end),
        total: enrichedMainPages.length,
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
      showAddButton
      showExport
      showSearch
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default MainPageList;
