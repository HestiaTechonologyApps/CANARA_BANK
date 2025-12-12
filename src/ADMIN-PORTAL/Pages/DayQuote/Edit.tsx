import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { DayQuote } from "../../Types/CMS/DayQuote.types";
import DayQuoteService from "../../Services/CMS/DayQuote.services";

const DayQuoteEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "dayQuoteId",
      rules: {
        type: "number",
        label: "ID",
        required: false,
        disabled: true,
        colWidth: 3,
      },
    },
    {
      name: "day",
      rules: {
        type: "number",
        label: "Day",
        required: true,
        minLength: 1,
        maxLength: 31,
        colWidth: 3,
      },
    },
    {
      name: "monthCode",
      rules: {
        type: "number",
        label: "Month",
        required: true,
        minLength: 1,
        maxLength: 12,
        colWidth: 3,
      },
    },
    {
      name: "toDayQuote",
      rules: {
        type: "text",
        label: "Quote",
        required: true,
        minLength: 1,
        maxLength: 500,
        colWidth: 12,
      },
    },
    {
      name: "unformatedContent",
      rules: {
        type: "textarea",
        label: "Unformatted Content",
        required: false,
        colWidth: 12,
      },
    },
  ];

  // Your service returns DayQuote (not CustomResponse),
  // so wrap it to match KiduEdit’s expected shape if it expects { value }.
  const handleFetch = async (id: string) => {
    const data = await DayQuoteService.getDayQuoteById(Number(id));
    return { value: data }; // if KiduEdit expects value; otherwise, just return data
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Omit<DayQuote, "auditLogs"> = {
      dayQuoteId: Number(id),
      day: Number(formData.day),
      monthCode: Number(formData.monthCode),
      toDayQuote: (formData.toDayQuote || "").trim(),
      unformatedContent: (formData.unformatedContent || "").trim(),
    };

    if (payload.day < 1 || payload.day > 31) throw new Error("Day must be between 1 and 31.");
    if (payload.monthCode < 1 || payload.monthCode > 12) throw new Error("Month must be between 1 and 12.");

    await DayQuoteService.updateDayQuote(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Day Quote"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Day Quote"
      showResetButton
      successMessage="Day quote updated successfully!"
      errorMessage="Failed to update day quote. Please try again."
      paramName="dayQuoteId"
      navigateBackPath="/dashboard/cms/dayquote-list"
      loadingText="Loading Day Quote..."
      auditLogConfig={{
        tableName: "DayQuote",
        recordIdField: "dayQuoteId",
      }}
      themeColor="#18575A"
    />
  );
};

export default DayQuoteEdit;
