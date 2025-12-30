// src/components/DailyNews/DailyNewsCreate.tsx
import React, { useState } from "react";
import type { Field } from "../../Components/KiduCreate";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import KiduCreate from "../../Components/KiduCreate";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const DailyNewsCreate: React.FC = () => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fields: Field[] = [
    { name: "title", rules: { type: "text", label: "Title", required: true, colWidth: 6 } },
    { name: "newsDate", rules: { type: "date", label: "News Date", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, colWidth: 12 } },
    { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedCompany) throw new Error("Please select a company");

    const isoDate = new Date(formData.newsDate).toISOString();

    const payload: Omit<DailyNews, "dailyNewsId" | "auditLogs"> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      newsDate: isoDate,
      newsDateString: isoDate,
      companyId: selectedCompany.companyId,
      isActive: Boolean(formData.isActive),
      isDeleted: false,
      createdOn: new Date().toISOString(),
      createdBy: "SYSTEM",
    };

    await DailyNewsService.createDailyNews(payload);
  };

  const popupHandlers = {
    companyId: {
      value: selectedCompany?.comapanyName ?? "",
      onOpen: () => setShowCompanyPopup(true),
    },
  };

  return (
    <>
      <KiduCreate
        title="Create Daily News"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create News"
        successMessage="Daily news created successfully!"
        errorMessage="Failed to create daily news"
        navigateOnSuccess="/dashboard/cms/dailynews-list"
        popupHandlers={popupHandlers}
        themeColor="#18575A"
      />

      <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={(company) => {
          setSelectedCompany(company);
          setShowCompanyPopup(false);
        }}
      />
    </>
  );
};

export default DailyNewsCreate;
