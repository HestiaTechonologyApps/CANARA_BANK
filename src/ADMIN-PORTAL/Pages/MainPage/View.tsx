// src/components/MainPage/MainPageView.tsx
import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import MainPageService from "../../Services/CMS/MainPage.services";

const MainPageView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "mainPageId", label: "ID", icon: "bi-hash" },
    { key: "companyId", label: "Company ID", icon: "bi-building" },
    { key: "companyName", label: "Company Name", icon: "bi-building-check" },

    { key: "mainText", label: "Main Text", icon: "bi-file-text" },
    { key: "slogan", label: "Slogan", icon: "bi-megaphone" },

    { key: "corouselImage1", label: "Carousel Image 1 (URL)", icon: "bi-image" },
    { key: "corouselImage2", label: "Carousel Image 2 (URL)", icon: "bi-image" },
    { key: "corouselImage3", label: "Carousel Image 3 (URL)", icon: "bi-image" },

    { key: "logoImage1", label: "Logo Image 1 (URL)", icon: "bi-badge-ad" },
    { key: "logoImage2", label: "Logo Image 2 (URL)", icon: "bi-badge-ad" },

    { key: "contactDesc1", label: "Contact Desc 1", icon: "bi-card-text" },
    { key: "contactDesc2", label: "Contact Desc 2", icon: "bi-card-text" },
    { key: "contactLine1", label: "Contact Line 1", icon: "bi-chat-dots" },
    { key: "contactLine2", label: "Contact Line 2", icon: "bi-chat-dots" },
    { key: "contactLine3", label: "Contact Line 3", icon: "bi-chat-dots" },

    { key: "phonenum", label: "Phone", icon: "bi-telephone" },
    { key: "faxnum", label: "Fax Number", icon: "bi-printer" },
    { key: "website", label: "Website", icon: "bi-globe2" },
    { key: "email", label: "Email", icon: "bi-envelope" },

    { key: "rulesRegulation", label: "Rules & Regulations", icon: "bi-journal-text" },
    { key: "dayQuote", label: "Day Quote", icon: "bi-stars" },
  ];

  const handleFetch = async (mainPageId: string) => {
    const response = await MainPageService.getMainPageById(Number(mainPageId));
    return response;
  };

  const handleDelete = async (mainPageId: string) => {
    await MainPageService.deleteMainPage(Number(mainPageId));
  };

  return (
    <KiduView
      title="Main Page Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/cms/mainpage-edit"
      listRoute="/dashboard/cms/mainpage-list"
      paramName="mainPageId"
      imageConfig={{
        fieldName: "logoImage1",           
        defaultImage: "",                   
        showNameField: "companyName",
        showIdField: "mainPageId",
        isCircle: false,
      }}
      auditLogConfig={{
        tableName: "MainPage",
        recordIdField: "mainPageId",
      }}
      themeColor="#1B3763"
      loadingText="Loading main page details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this main page? This action cannot be undone."
    />
  );
};

export default MainPageView;
