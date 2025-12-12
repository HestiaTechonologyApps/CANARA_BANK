import React from "react";
import type { MainPage } from "../../Types/CMS/MainPage.types";
import MainPageService from "../../Services/CMS/MainPage.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "mainPageId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "companyId", label: "Company ID", enableSorting: true, type: "text" as const },
  { key: "companyName", label: "Company Name", enableSorting: true, type: "text" as const },
  { key: "mainText", label: "Main Text", enableSorting: false, type: "text" as const },
  { key: "slogan", label: "Slogan", enableSorting: false, type: "text" as const },
  { key: "corouselImage1", label: "Carousel Image 1", enableSorting: false, type: "image" as const },
  { key: "corouselImage2", label: "Carousel Image 2", enableSorting: false, type: "image" as const },
  { key: "corouselImage3", label: "Carousel Image 3", enableSorting: false, type: "image" as const },
  { key: "logoImage1", label: "Logo Image 1", enableSorting: false, type: "image" as const },
  { key: "logoImage2", label: "Logo Image 2", enableSorting: false, type: "image" as const },
  { key: "contactDesc1", label: "Contact Desc 1", enableSorting: false, type: "text" as const },
  { key: "contactDesc2", label: "Contact Desc 2", enableSorting: false, type: "text" as const },
  { key: "contactLine1", label: "Contact Line 1", enableSorting: false, type: "text" as const },
  { key: "contactLine2", label: "Contact Line 2", enableSorting: false, type: "text" as const },
  { key: "contactLine3", label: "Contact Line 3", enableSorting: false, type: "text" as const },
  { key: "phonenum", label: "Phone", enableSorting: false, type: "text" as const },
  { key: "faxnum", label: "Fax Number", enableSorting: false, type: "text" as const },
  { key: "website", label: "Website", enableSorting: false, type: "text" as const },
  { key: "email", label: "Email", enableSorting: false, type: "text" as const },
  { key: "rulesRegulation", label: "Rules & Regulations", enableSorting: false, type: "text" as const },
  { key: "dayQuote", label: "Day Quote", enableSorting: false, type: "text" as const },
];

const MainPageList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: MainPage[]; total: number }> => {
    try {
      // Fetch all main pages
      const items = await MainPageService.getAllMainPages();

      // Search filter
      let filtered = items;
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();
        filtered = items.filter((x) =>
          [
            x.companyName,
            x.website,
            x.email,
            x.phonenum,
            x.faxnum,
            x.slogan,
            x.mainText,
            x.dayQuote,
            x.rulesRegulation,
            x.contactDesc1,
            x.contactDesc2,
            x.contactLine1,
            x.contactLine2,
            x.contactLine3,
            x.corouselImage1,
            x.corouselImage2,
            x.corouselImage3,
            x.logoImage1,
            x.logoImage2,
          ]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q)) ||
          String(x.mainPageId).includes(q) ||
          String(x.companyId).includes(q)
        );
      }

      // Pagination logic
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;
      const paginated = filtered.slice(start, end);

      return { data: paginated, total: filtered.length };
    } catch (error: any) {
      console.error("Error fetching main pages:", error);
      throw new Error(error.message || "Failed to fetch main pages");
    }
  };

  return (
    <KiduServerTable
      title="Main Page Management"
      subtitle="Manage main page details including images, contact info, and quotes"
      columns={columns}
      idKey="mainPageId"
      addButtonLabel="Add Main Page"
      addRoute="/dashboard/cms/mainpage-create"
      editRoute="/dashboard/cms/mainpage-edit/:mainPageId"
      viewRoute="/dashboard/cms/mainpage-view/:mainPageId"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default MainPageList;
