// src/components/CMS/PublicPage/PublicPageList.tsx

import React from "react";
import type { PublicPage } from "../../Types/CMS/PublicPage.types";
import PublicPageService from "../../Services/CMS/PublicPage.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const PublicPageList: React.FC = () => {
  const columns: any[] = [
    { 
      key: "publicPageId", 
      label: "ID", 
      enableSorting: true, 
      type: "text"
    },
    { 
      key: "navBrandTitle", 
      label: "Brand Title", 
      enableSorting: true, 
      type: "text"
    },
    { 
      key: "navBrandSubTitle", 
      label: "Subtitle", 
      enableSorting: true, 
      type: "text"
    },
    { 
      key: "isActive", 
      label: "Active", 
      enableSorting: true, 
      type: "boolean"
    },
  ];

  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: PublicPage[]; total: number }> => {
    const pages = await PublicPageService.getAllPublicPages();

    let filtered = pages;
    if (params.searchTerm) {
      const searchLower = params.searchTerm.toLowerCase();
      filtered = pages.filter(
        (p) =>
          p.navBrandTitle?.toLowerCase().includes(searchLower) ||
          p.navBrandSubTitle?.toLowerCase().includes(searchLower) ||
          p.publicPageId?.toString().includes(params.searchTerm)
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
    };
  };

  return (
    <KiduServerTable
      title="Public Page CMS"
      subtitle="Manage public website content"
      columns={columns}
      idKey="publicPageId"
      addButtonLabel="Add Public Page"
      addRoute="/dashboard/cms/publicPage-create"
      viewRoute="/dashboard/cms/publicPage-view"
      showAddButton={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default PublicPageList;