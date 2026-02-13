import React from "react";
import PublicPageService from "../../Services/CMS/PublicPage.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const PublicPageList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => await PublicPageService.getAllPublicPages()}
      columns={[
        { key: "publicPageId", label: "Public Page ID", enableSorting: true, type: "text" },
        { key: "navBrandTitle", label: "Brand", enableSorting: true, type: "text" },
        { key: "homeHeroTitle", label: "Hero Title", enableSorting: true, type: "text" },
        { key: "isActive", label: "Active", enableSorting: true, type: "checkbox" },
      ]}
      filterColumns={[
        { key: "publicPageId", label: "Public Page ID", type: "text" },
        { key: "navBrandTitle", label: "Brand", type: "text" },
        { key: "homeHeroTitle", label: "Hero Title", type: "text" },
      ]}

      idKey="publicPageId"
      title="Public Page Management"
      subtitle="Manage public page with search, filter, and pagination"
      addButtonLabel="Add Content"
      addRoute="/dashboard/cms/publicPage-create"
      editRoute="/dashboard/cms/publicPage-edit"
      showAddButton
      showSearch
      showActions
      showExport
      rowsPerPage={10}
    />
  );
};

export default PublicPageList;
