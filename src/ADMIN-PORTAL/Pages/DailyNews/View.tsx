// src/components/DailyNews/DailyNewsView.tsx
import React from "react";
import KiduView from "../../Components/KiduView";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import type { ViewField } from "../../Components/KiduView";

const DailyNewsView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "dailyNewsId", label: "ID" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "newsDate", label: "News Date" },
    { key: "companyId", label: "Company ID" },
    { key: "isActive", label: "Active" },
  ];

const handleFetch = async (id: string) => {
  const data = await DailyNewsService.getDailyNewsById(Number(id));

  // 🔥 THIS IS THE FIX
  return {
    isSuccess: true,
    value: data,
  };
};


  const handleDelete = async (id: string) => {
    await DailyNewsService.deleteDailyNews(Number(id));
  };

  return (
    <KiduView
      title="Daily News Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/cms/dailynews-edit"
      listRoute="/dashboard/cms/dailynews-list"
      paramName="dailyNewsId"
      auditLogConfig={{ tableName: "DailyNews", recordIdField: "dailyNewsId" }}
      themeColor="#18575A"
    />
  );
};

export default DailyNewsView;
