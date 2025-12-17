// src/components/DailyNews/DailyNewsList.tsx

import React from "react";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import KiduServerTable from "../../../Components/KiduServerTable";


const columns = [
  { key: "dailyNewsId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "title", label: "Title", enableSorting: true, type: "text" as const },
  { key: "newsDate", label: "Date", enableSorting: true, type: "text" as const },
  { key: "companyId", label: "Company ID", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "text" as const },
];

const DailyNewsList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: DailyNews[]; total: number }> => {
    const news = await DailyNewsService.getAllDailyNews();

    let filtered = news;
    if (params.searchTerm) {
      const searchLower = params.searchTerm.toLowerCase();
      filtered = news.filter(
        (n) =>
          n.title?.toLowerCase().includes(searchLower) ||
          n.description?.toLowerCase().includes(searchLower) ||
          n.dailyNewsId?.toString().includes(params.searchTerm)
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
    };
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
      showExport
      showSearch
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default DailyNewsList;
