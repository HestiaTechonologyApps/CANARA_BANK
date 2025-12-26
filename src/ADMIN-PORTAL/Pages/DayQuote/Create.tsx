import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { DayQuote } from "../../Types/CMS/DayQuote.types";
import DayQuoteService from "../../Services/CMS/DayQuote.services";

const DayQuoteCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

 const fields: Field[] = [
  { name: "day", rules: { type: "number", label: "Day", required: true, minLength: 1, maxLength: 31, placeholder: "Enter day", colWidth: 4 } },
  { name: "monthCode", rules: { type: "number", label: "Month", required: true, minLength: 1, maxLength: 12, placeholder: "Enter month", colWidth: 4 } },
  { name: "toDayQuote", rules: { type: "text", label: "Quote", required: true, minLength: 1, maxLength: 500, placeholder: "Enter the quote text", colWidth: 12 } },
  { name: "unformatedContent", rules: { type: "textarea", label: "Unformatted Content", required: false, placeholder: "Optional raw/HTML content", colWidth: 12 } },
];


  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const payload: Omit<DayQuote, "dayQuoteId" | "auditLogs"> = {
        day: Number(formData.day),
        monthCode: Number(formData.monthCode),
        toDayQuote: (formData.toDayQuote || "").trim(),
        unformatedContent: (formData.unformatedContent || "").trim(),
      };

      // extra guard
      if (payload.day < 1 || payload.day > 31) throw new Error("Day must be between 1 and 31.");
      if (payload.monthCode < 1 || payload.monthCode > 12) throw new Error("Month must be between 1 and 12.");

      await DayQuoteService.createDayQuote(payload);
    } catch (err) {
      console.error("Error creating day quote:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Day Quote"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Day Quote"
      showResetButton
      loadingState={isLoading}
      successMessage="Day quote created successfully!"
      errorMessage="Failed to create day quote. Please check the details and try again."
      navigateOnSuccess="/dashboard/cms/dayquote-list"
      navigateDelay={1200}
      themeColor="#18575A"
    />
  );
};

export default DayQuoteCreate;
