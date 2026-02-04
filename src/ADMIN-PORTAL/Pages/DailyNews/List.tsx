import React from "react";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import type { Company } from "../../Types/Settings/Company.types";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import CompanyService from "../../Services/Settings/Company.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const DailyNewsList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={async () => {
        const [news, companies] = await Promise.all([
          DailyNewsService.getAllDailyNews(),
          CompanyService.getAllCompanies(),
        ]);

        const companyMap = new Map<number, string>(
          companies.map((c: Company) => [c.companyId, c.comapanyName])
        );

        return news.map((n: DailyNews) => ({
          ...n,
          companyName: companyMap.get(n.companyId) ?? "-",
          newsDate: n.newsDate
            ? new Date(n.newsDate).toLocaleDateString("en-GB")
            : "",
        }));
      }}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "dailyNewsId", label: "Daily News ID", enableSorting: true, type: "text" },
        { key: "title", label: "Title", enableSorting: true, type: "text" },
        { key: "newsDate", label: "Date", enableSorting: true, type: "text" },
        { key: "companyName", label: "Company", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      /* ================= KEYS ================= */
      idKey="dailyNewsId"

      /* ================= UI ================= */
      title="Daily News Management"
      subtitle="Manage daily news articles with search, filter, and pagination."

      /* ================= ROUTES ================= */
      addButtonLabel="Add News"
      addRoute="/dashboard/cms/dailynews-create"
      editRoute="/dashboard/cms/dailynews-edit"
      viewRoute="/dashboard/cms/dailynews-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default DailyNewsList;
