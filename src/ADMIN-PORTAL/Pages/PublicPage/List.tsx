// src/components/CMS/PublicPage/PublicPageList.tsx
import React from "react";
//import type { PublicPage } from "../../Types/CMS/PublicPage.types";
import PublicPageService from "../../Services/CMS/PublicPage.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "publicPageId", label: "Public Page ID", enableSorting: true, type: "text" as const },
  { key: "navBrandTitle", label: "Brand", enableSorting: true, type: "text" as const },
  { key: "homeHeroTitle", label: "Hero Title", enableSorting: true, type: "text" as const },
  { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" as const },
];

const PublicPageList: React.FC = () => {
  const fetchData = async ({ pageNumber, pageSize, searchTerm }: any) => {
    const data = await PublicPageService.getAllPublicPages();

    let filtered = data;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = data.filter(
        (p) =>
          p.navBrandTitle?.toLowerCase().includes(q) ||
          p.homeHeroTitle?.toLowerCase().includes(q)
      );
    }

    const start = (pageNumber - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
    };
  };

  return (
    <KiduServerTable
      title="Public Page Management"
      subtitle="Manage public page with search, filter, and pagination"
      columns={columns}
      idKey="publicPageId"
      addButtonLabel="Add Public Page"
      fetchData={fetchData}
      addRoute="/dashboard/cms/publicPage-create"
      editRoute="/dashboard/cms/publicPage-edit"
      viewRoute="/dashboard/cms/publicPage-view"
      showAddButton={true}
      showSearch={true}
      showActions={true}
      showExport={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default PublicPageList;
