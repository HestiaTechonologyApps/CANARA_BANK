import React from "react";
import type { DayQuote } from "../../Types/CMS/DayQuote.types";
import DayQuoteService from "../../Services/CMS/DayQuote.services";
import KiduServerTable from "../../../Components/KiduServerTable";
import MonthService from "../../Services/Settings/Month.services";
import type { Month } from "../../Types/Settings/Month.types";

const columns = [
  { key: "dayQuoteId", label: "Day Quote ID", type: "text" as const },
  { key: "day", label: "Day", type: "text" as const },
  { key: "monthName", label: "Month", type: "text" as const },
  { key: "toDayQuote", label: "Quote", type: "text" as const },
];

const DayQuoteList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      const [dayQuotes, months] = await Promise.all([
        DayQuoteService.getAllDayQuotes(),
        MonthService.getAllMonths(),
      ]);

      const monthMap = Object.fromEntries(
        months.map((m: Month) => [m.monthCode, m.monthName])
      );

      let enrichedDayQuotes = dayQuotes.map((d: DayQuote) => ({
        ...d,
        monthName: monthMap[d.monthCode] ?? "-",
      }));
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        enrichedDayQuotes = enrichedDayQuotes.filter((d) =>
          [
            d.dayQuoteId,
            d.day,
            d.monthName,
            d.toDayQuote,
          ]
            .map(String)
            .some((v) => v.toLowerCase().includes(q))
        );
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: enrichedDayQuotes.slice(start, end),
        total: enrichedDayQuotes.length,
      };
    } catch (error: any) {
      console.error("Error fetching Day Quotes:", error);
      throw new Error(error.message || "Failed to fetch Day Quotes");
    }
  };

  return (
    <KiduServerTable
      title="Day Quotes Management"
      subtitle="Manage day quotes articles with search, filter, and pagination."
      columns={columns}
      idKey="dayQuoteId"
      addButtonLabel="Add Quotes"
      addRoute="/dashboard/cms/dayquote-create"
      editRoute="/dashboard/cms/dayquote-edit"
      viewRoute="/dashboard/cms/dayquote-view"
      fetchData={fetchData}
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default DayQuoteList;
