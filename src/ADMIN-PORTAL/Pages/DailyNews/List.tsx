// src/components/CMS/DailyNews/DailyNewsList.tsx

import React from "react";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import type { Company } from "../../Types/Settings/Company.types";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import CompanyService from "../../Services/Settings/Company.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "dailyNewsId", label: "Daily News ID", enableSorting: true, type: "text" as const },
  { key: "title", label: "Title", enableSorting: true, type: "text" as const },
  { key: "newsDate", label: "Date", enableSorting: true, type: "text" as const },
  { key: "companyName", label: "Company", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const DailyNewsList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: DailyNews[]; total: number }> => {
    try {
      const [news, companies] = await Promise.all([
        DailyNewsService.getAllDailyNews(),
        CompanyService.getAllCompanies(),
      ]);

      const companyMap = Object.fromEntries(
        companies.map((c: Company) => [c.companyId, c.comapanyName])
      );

      let enrichedNews: any[] = news.map((n: DailyNews) => ({
        ...n,
        companyName: companyMap[n.companyId] ?? "-",
      }));

      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();

        enrichedNews = enrichedNews.filter((n) =>
          [
            n.title,
            n.newsDate,
            n.companyName,
            n.dailyNewsId?.toString(),
            n.isActive?.toString(),
          ]
            .filter(Boolean)
            .map(String)
            .some(v => v.toLowerCase().includes(q))
        );
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: enrichedNews.slice(start, end),
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
      subtitle="Manage daily news articles with search, filter, and pagination."
      columns={columns}
      idKey="dailyNewsId"
      addButtonLabel="Add News"
      addRoute="/dashboard/cms/dailynews-create"
      editRoute="/dashboard/cms/dailynews-edit"
      viewRoute="/dashboard/cms/dailynews-view"
      fetchData={fetchData}
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default DailyNewsList;
