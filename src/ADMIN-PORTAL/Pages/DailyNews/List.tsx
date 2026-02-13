import React from "react";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import type { Company } from "../../Types/Settings/Company.types";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import CompanyService from "../../Services/Settings/Company.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const DailyNewsList: React.FC = () => {
  return (
    <KiduServerTableList
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

      columns={[
        { key: "dailyNewsId", label: "Daily News ID", enableSorting: true, type: "text" },
        { key: "title", label: "Title", enableSorting: true, type: "text" },
        { key: "newsDate", label: "Date", enableSorting: true, type: "text" },
        { key: "companyName", label: "Company", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}

      filterColumns={[
        { key: "dailyNewsId", label: "Daily News ID", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "newsDate", label: "Date", type: "text" },
        { key: "companyName", label: "Company", type: "text" },
      ]}

      idKey="dailyNewsId"
      title="Daily News Management"
      subtitle="Manage daily news articles with search, filter, and pagination."
      addButtonLabel="Add News"
      addRoute="/dashboard/cms/dailynews-create"
      editRoute="/dashboard/cms/dailynews-edit"
      viewRoute="/dashboard/cms/dailynews-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default DailyNewsList;
