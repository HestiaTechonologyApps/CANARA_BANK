// src/components/CMS/DayQuoteCreate.tsx
import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { DayQuote } from "../../Types/CMS/DayQuote.types";
import DayQuoteService from "../../Services/CMS/DayQuote.services";
import type { Month } from "../../Types/Settings/Month.types";
import MonthPopup from "../Settings/Month/MonthPopup";

const DayQuoteCreate: React.FC = () => {
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  const fields: Field[] = [
    { name: "day", rules: { type: "number", label: "Day", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },
    { name: "toDayQuote", rules: { type: "text", label: "Quote", required: true, colWidth: 6 } },
    { name: "unformatedContent", rules: { type: "textarea", label: "Unformatted Content", colWidth: 6 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedMonth) throw new Error("Please select a month");

    const payload: Omit<DayQuote, "dayQuoteId" | "auditLogs"> = {
      day: Number(formData.day),
      monthCode: selectedMonth.monthCode,
      toDayQuote: formData.toDayQuote.trim(),
      unformatedContent: formData.unformatedContent?.trim() || "",
    };

    await DayQuoteService.createDayQuote(payload);
  };

  const popupHandlers = {
    monthCode: {
      value: selectedMonth?.monthName ?? "",
      onOpen: () => setShowMonthPopup(true),
    },
  };

  return (
    <>
      <KiduCreate
        title="Create Day Quote"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Day Quote"
        showResetButton
        successMessage="Day quote created successfully!"
        errorMessage="Failed to create day quote"
        navigateOnSuccess="/dashboard/cms/dayquote-list"
         navigateDelay={1500}
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
      />
      <MonthPopup
        show={showMonthPopup}
        handleClose={() => setShowMonthPopup(false)}
        onSelect={(m) => {
          setSelectedMonth(m);
          setShowMonthPopup(false);
        }}
      />
    </>
  );
};

export default DayQuoteCreate;
