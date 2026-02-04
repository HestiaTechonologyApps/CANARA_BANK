import React from "react";
import type { MainPage } from "../../Types/CMS/MainPage.types";
import type { Company } from "../../Types/Settings/Company.types";
import MainPageService from "../../Services/CMS/MainPage.services";
import CompanyService from "../../Services/Settings/Company.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const MainPageList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA ================= */
      fetchService={async (): Promise<any[]> => {
        const [mainPages, companies] = await Promise.all([
          MainPageService.getAllMainPages(),
          CompanyService.getAllCompanies(),
        ]);

        const companyMap = Object.fromEntries(
          companies.map((c: Company) => [c.companyId, c.comapanyName])
        );

        return mainPages.map((m: MainPage) => ({
          ...m,
          companyName: companyMap[m.companyId] ?? "-",
        }));
      }}

      /* ================= COLUMNS ================= */
      columns={[
        { key: "mainPageId", label: "Main Page ID", enableSorting: true, type: "text" },
        { key: "companyName", label: "Company", enableSorting: true, type: "text" },
        { key: "website", label: "Website", enableSorting: false, type: "text" },
        { key: "email", label: "Email", enableSorting: false, type: "text" },
        { key: "rulesRegulation", label: "Rules & Regulations", enableSorting: false, type: "text" },
        { key: "dayQuote", label: "Day Quote", enableSorting: false, type: "text" },
      ]}

      /* ================= TABLE ================= */
      idKey="mainPageId"
      title="Main Page Management"
      subtitle="Manage main page details with search, filter, and pagination."

      /* ================= ROUTES ================= */
      addButtonLabel="Add Main Page"
      addRoute="/dashboard/cms/mainpage-create"
      editRoute="/dashboard/cms/mainpage-edit"
      viewRoute="/dashboard/cms/mainpage-view"

      /* ================= FEATURES ================= */
      showAddButton
      showExport
      showSearch
      showActions

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default MainPageList;
