// src/components/CMS/DayQuoteView.tsx
import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import DayQuoteService from "../../Services/CMS/DayQuote.services";

const DayQuoteView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "dayQuoteId", label: "ID" },
    { key: "day", label: "Day" },
    { key: "monthCode", label: "Month" },
    { key: "toDayQuote", label: "Quote" },
    { key: "unformatedContent", label: "Content" },
  ];

  const handleFetch = async (id: string) => {
    return await DayQuoteService.getDayQuoteById(Number(id));
  };

  const handleDelete = async (id: string) => {
    await DayQuoteService.deleteDayQuote(Number(id));
  };

  return (
    <KiduView
      title="Day Quote Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/cms/dayquote-edit"
      listRoute="/dashboard/cms/dayquote-list"
      paramName="dayQuoteId"
      auditLogConfig={{ tableName: "DayQuote", recordIdField: "dayQuoteId" }}
      themeColor="#18575A"
      loadingText="Loading day quote..."
      showEditButton
      showDeleteButton
      deleteConfirmMessage="Are you sure you want to delete this day quote?"
      />
  );
};

export default DayQuoteView;
