// src/components/CMS/DayQuote/DayQuoteList.tsx
import React from "react";
import DayQuoteService from "../../Services/CMS/DayQuote.services";
import MonthService from "../../Services/Settings/Month.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import type { DayQuote } from "../../Types/CMS/DayQuote.types";
import type { Month } from "../../Types/Settings/Month.types";

const DayQuoteList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => {
        const [dayQuotes, months] = await Promise.all([
          DayQuoteService.getAllDayQuotes(),
          MonthService.getAllMonths(),
        ]);

        const monthMap = Object.fromEntries(
          months.map((m: Month) => [m.monthCode, m.monthName])
        );

        return dayQuotes.map((d: DayQuote) => ({
          ...d,
          monthName: monthMap[d.monthCode] ?? "-",
        }));
      }}
      columns={[
        { key: "dayQuoteId", label: "Day Quote ID", enableSorting: true, type: "text" },
        { key: "day", label: "Day", enableSorting: true, type: "text" },
        { key: "monthName", label: "Month", enableSorting: true, type: "text" },
        { key: "toDayQuote", label: "Quote", enableSorting: true, type: "text" },
      ]}
      idKey="dayQuoteId"
      title="Day Quotes Management"
      subtitle="Manage day quotes articles with search, filter, and pagination."
      addButtonLabel="Add Quotes"
      addRoute="/dashboard/cms/dayquote-create"
      editRoute="/dashboard/cms/dayquote-edit"
      viewRoute="/dashboard/cms/dayquote-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default DayQuoteList;
