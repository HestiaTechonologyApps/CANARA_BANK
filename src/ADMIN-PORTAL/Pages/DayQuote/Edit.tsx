// src/components/CMS/DayQuoteEdit.tsx
import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { DayQuote } from "../../Types/CMS/DayQuote.types";
import DayQuoteService from "../../Services/CMS/DayQuote.services";
import type { Month } from "../../Types/Settings/Month.types";
import MonthPopup from "../Settings/Month/MonthPopup";

const DayQuoteEdit: React.FC = () => {
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  const fields: Field[] = [
    { name: "day", rules: { type: "number", label: "Day", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },
    { name: "toDayQuote", rules: { type: "text", label: "Quote", required: true, colWidth: 12 } },
    { name: "unformatedContent", rules: { type: "textarea", label: "Unformatted Content", colWidth: 12 } },
  ];

  const handleFetch = async (id: string) => {
    const response = await DayQuoteService.getDayQuoteById(Number(id));

    setSelectedMonth({
      monthCode: response.value.monthCode,
      monthName: `Month ${response.value.monthCode}`,
    } as Month);

    return response; // 🔥 CustomResponse returned
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedMonth) throw new Error("Please select a month");

    const payload: Omit<DayQuote, "auditLogs"> = {
      dayQuoteId: Number(id),
      day: Number(formData.day),
      monthCode: selectedMonth.monthCode,
      toDayQuote: formData.toDayQuote.trim(),
      unformatedContent: formData.unformatedContent?.trim() || "",
    };

    await DayQuoteService.updateDayQuote(Number(id), payload);
  };

  const popupHandlers = {
    monthCode: {
      value: selectedMonth?.monthName ?? "",
      actualValue: selectedMonth?.monthCode,
      onOpen: () => setShowMonthPopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Day Quote"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        submitButtonText="Update Day Quote"
        showResetButton
        successMessage="Day quote updated successfully!"
        errorMessage="Failed to update day quote"
        paramName="dayQuoteId"
        navigateBackPath="/dashboard/cms/dayquote-list"
        auditLogConfig={{ tableName: "DayQuote", recordIdField: "dayQuoteId" }}
        themeColor="#18575A"
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

export default DayQuoteEdit;
