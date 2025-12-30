// src/components/DailyNews/DailyNewsEdit.tsx
import React, { useState } from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import DailyNewsService from "../../Services/CMS/DailyNews.services";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const DailyNewsEdit: React.FC = () => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fields: Field[] = [
    { name: "title", rules: { type: "text", label: "Title", required: true, colWidth: 6 } },
    { name: "newsDate", rules: { type: "date", label: "News Date", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, colWidth: 12 } },
    { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  ];

 const handleFetch = async (id: string) => {
  const data = await DailyNewsService.getDailyNewsById(Number(id));

  setSelectedCompany({
    companyId: data.companyId,
    comapanyName: `Company ID: ${data.companyId}`,
  } as Company);

  // 🔥 THIS IS THE FIX
  return {
    isSuccess: true,
    value: data,
  };
};


  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedCompany) throw new Error("Please select a company");

    const isoDate = new Date(formData.newsDate).toISOString();

    const payload: Omit<DailyNews, "auditLogs"> = {
      dailyNewsId: Number(id),
      title: formData.title.trim(),
      description: formData.description.trim(),
      newsDate: isoDate,
      newsDateString: isoDate,
      companyId: selectedCompany.companyId,
      isActive: Boolean(formData.isActive),
      isDeleted: false,
      createdOn: formData.createdOn,
      createdBy: formData.createdBy,
    };

    await DailyNewsService.updateDailyNews(Number(id), payload);
  };

  const popupHandlers = {
    companyId: {
      value: selectedCompany?.comapanyName ?? "",
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
        onSelect={(c) => {
          setSelectedCompany(c);
          setShowCompanyPopup(false);
        }}
      />
    </>
  );
};

export default DailyNewsEdit;
