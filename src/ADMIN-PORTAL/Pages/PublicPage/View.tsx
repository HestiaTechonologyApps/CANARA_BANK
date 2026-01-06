// src/components/CMS/PublicPage/PublicPageView.tsx
import React from "react";
import type { ViewField } from "../../Components/KiduView";
import PublicPageService from "../../Services/CMS/PublicPage.services";
import KiduView from "../../Components/KiduView";


const PublicPageView: React.FC = () => {

  const fields: ViewField[] = [
    { key: "publicPageId", label: "Page ID", icon: "bi-hash" },
    { key: "navBrandTitle", label: "Brand Title", icon: "bi-building" },
    { key: "navBrandSubTitle", label: "Brand Subtitle", icon: "bi-text-left" },
    { key: "navLogoUrl", label: "Logo URL", icon: "bi-image" },
    { key: "homeHeroTitle", label: "Hero Title", icon: "bi-stars" },
    { key: "homeHeroDescription", label: "Hero Description", icon: "bi-card-text" },
    { key: "footerBrandShortName", label: "Footer Brand", icon: "bi-layout-text-window" },
    { key: "isActive", label: "Active", icon: "bi-check-circle" },
  ];

  const handleFetch = async (publicPageId: string) => {
    const response = await PublicPageService.getAllPublicPages();
    return {
      value: response.find(p => p.publicPageId === Number(publicPageId)),
    };
  };

  const handleDelete = async (publicPageId: string) => {
    await PublicPageService.deletePublicPage(Number(publicPageId));
  };

  return (
    <KiduView
      title="Public Page Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      listRoute="/dashboard/cms/public-page-list"
      paramName="publicPageId"
      themeColor="#1B3763"
      loadingText="Loading public page..."
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this public page?"
    />
  );
};

export default PublicPageView;
