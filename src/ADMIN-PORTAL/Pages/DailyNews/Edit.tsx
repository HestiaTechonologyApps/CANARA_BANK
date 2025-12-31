// src/components/DailyNews/DailyNewsEdit.tsx
import React, { useState, useRef } from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const DailyNewsEdit: React.FC = () => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // 🔴 STORE ORIGINAL RECORD (CRITICAL FOR AUDIT LOG)
  const originalDataRef = useRef<DailyNews | null>(null);

  // ───────────────────── Fields ─────────────────────
  const fields: Field[] = [
    { name: "title", rules: { type: "text", label: "Title", required: true, colWidth: 6 } },
    { name: "newsDate", rules: { type: "date", label: "News Date", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, colWidth: 12 } },
    { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  ];

  // ───────────────────── FETCH ─────────────────────
  const handleFetch = async (id: string) => {
    const response = await DailyNewsService.getDailyNewsById(Number(id));
    const news = response.value;

    if (!news) throw new Error("Daily news not found");

    // 🔴 SAVE ORIGINAL RECORD (MANDATORY)
    originalDataRef.current = news;

    // popup binding
    setSelectedCompany({ companyId: news.companyId } as Company);

    return response; // MUST return CustomResponse
  };

  // ───────────────────── UPDATE (CORRECT WAY) ─────────────────────
  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!originalDataRef.current) {
      throw new Error("Original data missing");
    }
    if (!selectedCompany) {
      throw new Error("Please select a company");
    }

    const original = originalDataRef.current;

    const isoDate = new Date(formData.newsDate).toISOString();

    // 🔥 MERGE ORIGINAL + CHANGES
    const payload: DailyNews = {
      ...original,

      title: formData.title.trim(),
      description: formData.description.trim(),
      newsDate: isoDate,
      newsDateString: isoDate,
      companyId: selectedCompany.companyId,
      isActive: Boolean(formData.isActive),
    };

    await DailyNewsService.updateDailyNews(Number(id), payload);
  };

  // ───────────────────── POPUP HANDLER (MANDATORY FORMAT) ─────────────────────
  const popupHandlers = {
    companyId: {
      value: selectedCompany?.companyId?.toString() || "",
      actualValue: selectedCompany?.companyId,
      onOpen: () => setShowCompanyPopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Daily News"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="dailyNewsId"
        navigateBackPath="/dashboard/cms/dailynews-list"
        auditLogConfig={{ tableName: "DailyNews", recordIdField: "dailyNewsId" }}
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

export default DailyNewsEdit;
