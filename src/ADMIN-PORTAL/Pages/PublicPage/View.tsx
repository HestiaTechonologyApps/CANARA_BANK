// src/components/CMS/PublicPage/PublicPageView.tsx
import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import PublicPageService from "../../Services/CMS/PublicPage.services";
import type { PublicPage } from "../../Types/CMS/PublicPage.types";

const PublicPageView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "publicPageId", label: "Public Page ID" },
    { key: "navBrandTitle", label: "Brand Title" },
    { key: "navBrandSubTitle", label: "Brand Subtitle" },
    { key: "homeHeroTitle", label: "Hero Title" },
    { key: "homeHeroDescription", label: "Hero Description" },
    { key: "footerBrandShortName", label: "Footer Brand" },
    { key: "isActive", label: "Active", isBoolean: true },
  ];

  const handleFetch = async (id: string) => {
    const page: PublicPage =
      await PublicPageService.getPublicPageById(Number(id));

    return {
      value: page, 
    };
  };

  const handleDelete = async (id: string) => {
    await PublicPageService.deletePublicPage(Number(id));
  };

  return (
    <KiduView
      title="Public Page Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/cms/publicPage-edit"
      listRoute="/dashboard/cms/publicPage-list"
      paramName="publicPageId"
      auditLogConfig={{
        tableName: "PublicPage",
        recordIdField: "publicPageId",
      }}
      themeColor="#1B3763"
      loadingText="Loading public page details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this Page? This action cannot be undone."
    />
  );
};

export default PublicPageView;
