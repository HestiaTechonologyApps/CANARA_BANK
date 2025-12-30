// src/components/CMS/DayQuoteList.tsx
import React from "react";
import type { DayQuote } from "../../Types/CMS/DayQuote.types";
import DayQuoteService from "../../Services/CMS/DayQuote.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "dayQuoteId", label: "ID", type: "text" as const },
  { key: "day", label: "Day", type: "text" as const },
  { key: "monthCode", label: "Month", type: "text" as const },
  { key: "toDayQuote", label: "Quote", type: "text" as const },
];

const DayQuoteList: React.FC = () => {
  const fetchData = async (params: any) => {
    const quotes = await DayQuoteService.getAllDayQuotes();
    return { data: quotes, total: quotes.length };
  };

  return (
    <KiduServerTable
      title="Day Quotes"
      columns={columns}
      idKey="dayQuoteId"
      addRoute="/dashboard/cms/dayquote-create"
      editRoute="/dashboard/cms/dayquote-edit"
      viewRoute="/dashboard/cms/dayquote-view"
      fetchData={fetchData}
    />
  );
};

export default DayQuoteList;
