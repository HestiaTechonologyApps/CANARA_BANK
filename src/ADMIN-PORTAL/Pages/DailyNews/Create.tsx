// src/components/DailyNews/DailyNewsCreate.tsx
import React from "react";
import type { Field } from "../../Components/KiduCreate";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import KiduCreate from "../../Components/KiduCreate";

const DailyNewsCreate: React.FC = () => {

  const fields: Field[] = [
    { name: "title", rules: { type: "text", label: "Title", required: true, colWidth: 6 } },
    { name: "newsDate", rules: { type: "date", label: "News Date", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, colWidth: 12 } },
   // { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {

    const isoDate = new Date(formData.newsDate).toISOString();

    const payload: Omit<DailyNews, "dailyNewsId" | "auditLogs"> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      newsDate: isoDate,
      newsDateString: isoDate,
      companyId: formData.companyId,
      isActive: Boolean(formData.isActive),
      isDeleted: false,
      createdOn: new Date().toISOString(),
      createdBy: "SYSTEM",
    };

    await DailyNewsService.createDailyNews(payload);
  };

  return (
      <KiduCreate
        title="Create Daily News"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create News"
        showResetButton
        successMessage="Daily news created successfully!"
        errorMessage="Failed to create daily news. Please try again."
        navigateOnSuccess="/dashboard/cms/dailynews-list"
        themeColor="#1B3763"
      />

  );
};

export default DailyNewsCreate;
