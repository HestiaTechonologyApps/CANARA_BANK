import React, {  useRef } from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";

const DailyNewsEdit: React.FC = () => {

  const originalDataRef = useRef<DailyNews | null>(null);

  const fields: Field[] = [
    { name: "title", rules: { type: "text", label: "Title", required: true, colWidth: 6 } },
    { name: "newsDate", rules: { type: "date", label: "News Date", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, colWidth: 12 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  ];

const handleFetch = async (id: string) => {
  const response = await DailyNewsService.getDailyNewsById(Number(id));
  const news = response.value;

  if (!news) throw new Error("Daily news not found");

  // ✅ TIMEZONE-SAFE conversion for <input type="date">
  if (news.newsDate) {
    const d = new Date(news.newsDate);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    news.newsDate = `${yyyy}-${mm}-${dd}`;
  }

  originalDataRef.current = news;
  return response;
};

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!originalDataRef.current) {
      throw new Error("Original data missing");
    }

    const original = originalDataRef.current;

    const isoDate = new Date(formData.newsDate).toISOString();

    const payload: DailyNews = {
      ...original,

      title: formData.title.trim(),
      description: formData.description.trim(),
      newsDate: isoDate,
      newsDateString: isoDate,
      isActive: Boolean(formData.isActive),
    };

    await DailyNewsService.updateDailyNews(Number(id), payload);
  };

  return (
      <KiduEdit
        title="Edit Daily News"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="dailyNewsId"
        submitButtonText="Update Daily News"
        showResetButton
        successMessage="Daily News updated successfully!"
        errorMessage="Failed to update Daily News. Please try again."
        loadingText="Loading Daily News..."
        navigateBackPath="/dashboard/cms/dailynews-list"
       // auditLogConfig={{ tableName: "DailyNews", recordIdField: "dailyNewsId" }}
        themeColor="#1B3763"
      />

  );
};

export default DailyNewsEdit;
