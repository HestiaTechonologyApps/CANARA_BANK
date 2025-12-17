// src/components/DailyNews/DailyNewsView.tsx

import React from "react";
import type { ViewField } from "../../Components/KiduView";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import KiduView from "../../Components/KiduView";


const DailyNewsView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "dailyNewsId", label: "ID", icon: "bi-hash" },
    { key: "title", label: "Title", icon: "bi-newspaper" },
    { key: "description", label: "Description", icon: "bi-card-text" },
    { key: "newsDate", label: "News Date", icon: "bi-calendar" },
    { key: "companyId", label: "Company ID", icon: "bi-building" },
    { key: "isActive", label: "Active", icon: "bi-check-circle" },
  ];

  const handleFetch = async (id: string) => {
    return await DailyNewsService.getDailyNewsById(Number(id));
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
      paramName="id"
      auditLogConfig={{
        tableName: "DailyNews",
        recordIdField: "dailyNewsId",
      }}
      themeColor="#18575A"
      loadingText="Loading daily news..."
      showEditButton
      showDeleteButton
      deleteConfirmMessage="Are you sure you want to delete this news?"
    />
  );
};

export default DailyNewsView;
