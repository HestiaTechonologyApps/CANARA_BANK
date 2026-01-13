// src/components/DailyNews/DailyNewsList.tsx
import React from "react";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import type { Company } from "../../Types/Settings/Company.types";

import DailyNewsService from "../../Services/CMS/DailyNews.services";
import CompanyService from "../../Services/Settings/Company.services";

import KiduServerTable from "../../../Components/KiduServerTable";

/* ===================== TABLE COLUMNS ===================== */
const columns = [
  { key: "dailyNewsId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "title", label: "Title", enableSorting: true, type: "text" as const },
  { key: "newsDate", label: "Date", enableSorting: true, type: "text" as const },
  { key: "companyName", label: "Company", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const DailyNewsList: React.FC = () => {
  const fetchData = async (_params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      /* ===================== FETCH DATA ===================== */
      const [news, companies] = await Promise.all([
        DailyNewsService.getAllDailyNews(),
        CompanyService.getAllCompanies(),
      ]);

      /* ===================== CREATE LOOKUP MAP ===================== */
      const companyMap = Object.fromEntries(
        companies.map((c: Company) => [c.companyId, c.comapanyName])
      );

      /* ===================== ENRICH DAILY NEWS ===================== */
      const enrichedNews = news.map((n: DailyNews) => ({
        ...n,
        companyName: companyMap[n.companyId] ?? "-",
      }));

      return {
        data: enrichedNews,
        total: enrichedNews.length,
      };
    } catch (error: any) {
      console.error("Error fetching daily news:", error);
      throw new Error(error.message || "Failed to fetch daily news");
    }
  };

  return (
    <KiduServerTable
      title="Daily News Management"
      subtitle="Manage daily news articles"
      columns={columns}
      idKey="dailyNewsId"
      addButtonLabel="Add News"
      addRoute="/dashboard/cms/dailynews-create"
      editRoute="/dashboard/cms/dailynews-edit"
      viewRoute="/dashboard/cms/dailynews-view"
      showAddButton
      showSearch
      showExport
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default DailyNewsList;
