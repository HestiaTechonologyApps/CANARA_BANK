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
  const fetchData = async (_params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: DayQuote[]; total: number }> => {
    const quotes = await DayQuoteService.getAllDayQuotes();
    return { data: quotes, total: quotes.length };
  };

  return (
    <KiduServerTable
      title="Day Quotes Management"
      subtitle="Manage day quotes articles"
      columns={columns}
      idKey="dayQuoteId"
      addButtonLabel="Add Quotes"
      addRoute="/dashboard/cms/dayquote-create"
      editRoute="/dashboard/cms/dayquote-edit"
      viewRoute="/dashboard/cms/dayquote-view"
      showAddButton
      showExport
      showSearch
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default DayQuoteList;
