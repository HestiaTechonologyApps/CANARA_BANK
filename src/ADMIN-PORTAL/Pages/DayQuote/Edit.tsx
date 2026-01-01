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
    { name: "toDayQuote", rules: { type: "text", label: "Quote", required: true, colWidth: 6 } },
    { name: "unformatedContent", rules: { type: "textarea", label: "Unformatted Content", colWidth: 6 } },
  ];

  // ================= FETCH =================
  const handleFetch = async (id: string) => {
    const response = await DayQuoteService.getDayQuoteById(Number(id));
    const quote = response.value;

    if (quote) {
      // IMPORTANT: hydrate popup like MemberEdit
      setSelectedMonth({ monthCode: quote.monthCode
      } as Month);
    }
    // else {
    //  setSelectedMonth(null);
    //}

    return response;
  };

  // ================= UPDATE =================
 const handleUpdate = async (id: string, formData: Record<string, any>) => {
  if (!selectedMonth) {
    throw new Error("Please select a month");
  }

  const payload: Partial<Omit<DayQuote, "dayQuoteId" | "auditLogs">> = {
    day: Number(formData.day),
    monthCode: selectedMonth.monthCode,
    toDayQuote: formData.toDayQuote.trim(),
    unformatedContent: formData.unformatedContent?.trim() || "",
  };

  await DayQuoteService.updateDayQuote(Number(id), payload);
};


  // ================= POPUP HANDLERS =================
  // const popupHandlers = {
  //   monthCode: {
  //     value: selectedMonth?.monthCode?.toString()|| "",   
  //     actualValue: selectedMonth?.monthCode,   
  //     onOpen: () => setShowMonthPopup(true),
  //   },
  // };
  const popupHandlers = {
  monthCode: {
    value: selectedMonth?.monthName || selectedMonth?.monthCode?.toString() || "",
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
        paramName="dayQuoteId"
        navigateBackPath="/dashboard/cms/dayquote-list"
        auditLogConfig={{ tableName: "DayQuote", recordIdField: "dayQuoteId" }}
        themeColor="#18575A"
        popupHandlers={popupHandlers}
      />

      <MonthPopup
        show={showMonthPopup}
        handleClose={() => setShowMonthPopup(false)}
        onSelect={setSelectedMonth}
      />
    </>
  );
};

export default DayQuoteEdit;
