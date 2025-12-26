// src/components/DailyNews/DailyNewsCreate.tsx

import React, { useState } from "react";
import type { Field } from "../../Components/KiduCreate";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import KiduCreate from "../../Components/KiduCreate";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const DailyNewsCreate: React.FC = () => {

  const[showCompanyPopup,setShowCompanyPopup]=useState(false);
  const[selectedCompany,setSelectedCompany]=useState<Company|null>(null);
  
  const fields: Field[] = [
    { name: "title", rules: { type: "text", label: "Title", required: true, minLength: 3, maxLength: 200, placeholder: "Enter news title", colWidth: 6 } },
    { name: "newsDate", rules: { type: "date", label: "News Date", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, minLength: 5, colWidth: 12 } },
    { name: "companyId", rules: { type: "popup", label: "Company ID", required: true, colWidth: 4 } },
    { name: "isActive", rules: { type: "checkbox", label: "Is Active", colWidth: 4 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      const payload: Omit<DailyNews, "dailyNewsId" | "auditLogs"> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        newsDate: new Date(formData.newsDate).toISOString(),
        newsDateString: new Date(formData.newsDate).toISOString(),
        companyId: Number(formData.companyId),
        isActive: Boolean(formData.isActive),
        isDeleted: false,
        createdOn: new Date().toISOString(),
        createdBy: "SYSTEM",
      };

      await DailyNewsService.createDailyNews(payload);
    } finally {
      // no loading state
    }
  };

  const popupHandlers={
    companyId:{
      value:selectedCompany?.comapanyName||"",
      onOpen:()=>setShowCompanyPopup(true),
    }
  }
  return (
   <>
      <KiduCreate
        title="Create Daily News"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create News"
        showResetButton
        successMessage="Daily news created successfully!"
        errorMessage="Failed to create daily news."
        navigateOnSuccess="/dashboard/cms/dailynews-list"
        navigateDelay={1500}
        themeColor="#18575A"
        popupHandlers={popupHandlers}
      />
      <CompanyPopup
      show={showCompanyPopup}
      handleClose={()=>setShowCompanyPopup(false)}
      onSelect={setSelectedCompany}
      />
   </>
  );
};

export default DailyNewsCreate;
