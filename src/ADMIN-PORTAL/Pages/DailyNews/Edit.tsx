// src/components/DailyNews/DailyNewsEdit.tsx

import React from "react";
import type { Field } from "../../Components/KiduCreate";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import KiduEdit from "../../Components/KiduEdit";


const DailyNewsEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "title",
      rules: {
        type: "text",
        label: "Title",
        required: true,
        minLength: 3,
        maxLength: 200,
        colWidth: 6,
      },
    },
    {
      name: "newsDate",
      rules: {
        type: "date",
        label: "News Date",
        required: true,
        colWidth: 6,
      },
    },
    {
      name: "description",
      rules: {
        type: "textarea",
        label: "Description",
        required: true,
        colWidth: 12,
      },
    },
    {
      name: "companyId",
      rules: {
        type: "number",
        label: "Company ID",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "isActive",
      rules: {
        type: "checkbox",
        label: "Is Active",
        colWidth: 4,
      },
    },
  ];

  const handleFetch = async (id: string) => {
    return await DailyNewsService.getDailyNewsById(Number(id));
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Omit<DailyNews, "auditLogs"> = {
      dailyNewsId: Number(id),
      title: formData.title.trim(),
      description: formData.description.trim(),
      newsDate: formData.newsDate,
      companyId: Number(formData.companyId),
      isActive: Boolean(formData.isActive),
      isDeleted: false,
      createdOn: formData.createdOn,
      createdBy: formData.createdBy,
    };

    await DailyNewsService.updateDailyNews(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Daily News"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update News"
      showResetButton
      successMessage="Daily news updated successfully!"
      errorMessage="Failed to update daily news."
      paramName="id"
      navigateBackPath="/dashboard/cms/dailynews-list"
      loadingText="Loading Daily News..."
      auditLogConfig={{
        tableName: "DailyNews",
        recordIdField: "dailyNewsId",
      }}
      themeColor="#18575A"
    />
  );
};

export default DailyNewsEdit;
