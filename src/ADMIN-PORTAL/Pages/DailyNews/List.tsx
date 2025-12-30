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
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];


const DailyNewsList: React.FC = () => {
  const fetchData = async (_params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: DailyNews[]; total: number }> => {
    const news = await DailyNewsService.getAllDailyNews();

   return { data:news, total:news.length}
    

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
