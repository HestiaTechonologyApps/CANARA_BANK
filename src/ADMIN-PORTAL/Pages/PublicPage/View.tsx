// src/components/CMS/PublicPage/PublicPageView.tsx
import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import PublicPageService from "../../Services/CMS/PublicPage.services";

const PublicPageView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "publicPageId", label: "ID" },
    { key: "navBrandTitle", label: "Brand Title" },
    { key: "navBrandSubTitle", label: "Brand Subtitle" },
    { key: "homeHeroTitle", label: "Hero Title" },
    { key: "homeHeroDescription", label: "Hero Description" },
    { key: "footerBrandShortName", label: "Footer Brand" },
    { key: "isActive", label: "Active", isBoolean: true },
  ];

  return (
    <KiduView
      title="Public Page Details"
      fields={fields}
      onFetch={(id) => PublicPageService.getPublicPageById(Number(id))}
      onDelete={(id) => PublicPageService.deletePublicPage(Number(id))}
      editRoute="/dashboard/cms/publicPage-edit"
      listRoute="/dashboard/cms/publicPage-list"
      paramName="publicPageId"
      auditLogConfig={{ tableName: "PublicPage", recordIdField: "publicPageId" }}
      themeColor="#1B3763"
      showEditButton
      showDeleteButton
    />
  );
};

export default PublicPageView;
