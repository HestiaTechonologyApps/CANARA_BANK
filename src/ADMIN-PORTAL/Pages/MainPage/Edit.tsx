// src/components/MainPage/MainPageEdit.tsx
import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { MainPage } from "../../Types/CMS/MainPage.types";
import MainPageService from "../../Services/CMS/MainPage.services";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const MainPageEdit: React.FC = () => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fields: Field[] = [
    //{ name: "mainPageId", rules: { type: "number", label: "Main Page ID", disabled: true, colWidth: 3 } },
    { name: "companyId", rules: { type: "popup", label: "Company ID", required: true, colWidth: 4 } },
    { name: "mainText", rules: { type: "textarea", label: "Main Text", required: true, colWidth: 4 } },
    { name: "slogan", rules: { type: "text", label: "Slogan", required: true, colWidth: 4 } },
    { name: "corouselImage1", rules: { type: "text", label: "Carousel Image 1", colWidth: 4 } },
    { name: "corouselImage2", rules: { type: "text", label: "Carousel Image 2", colWidth: 4 } },
    { name: "corouselImage3", rules: { type: "text", label: "Carousel Image 3", colWidth: 4 } },
    { name: "logoImage1", rules: { type: "text", label: "Logo Image 1", colWidth: 4 } },
    { name: "logoImage2", rules: { type: "text", label: "Logo Image 2", colWidth: 4 } },
    { name: "contactDesc1", rules: { type: "text", label: "Contact Desc 1", colWidth: 4 } },
    { name: "contactDesc2", rules: { type: "text", label: "Contact Desc 2", colWidth: 4 } },
    { name: "contactLine1", rules: { type: "text", label: "Contact Line 1", colWidth: 4 } },
    { name: "contactLine2", rules: { type: "text", label: "Contact Line 2", colWidth: 4 } },
    { name: "contactLine3", rules: { type: "text", label: "Contact Line 3", colWidth: 4 } },
    { name: "phonenum", rules: { type: "text", label: "Phone", required: true, colWidth: 4 } },
    { name: "faxnum", rules: { type: "text", label: "Fax", colWidth: 4 } },
    { name: "website", rules: { type: "text", label: "Website", required: true, colWidth: 4 } },
    { name: "email", rules: { type: "email", label: "Email", required: true, colWidth: 4 } },
    { name: "dayQuote", rules: { type: "text", label: "Day Quote", colWidth: 4 } },

    { name: "rulesRegulation", rules: { type: "textarea", label: "Rules & Regulations", colWidth: 6 } },
  ];

  
  const handleFetch = async (id: string) => {
    const response = await MainPageService.getMainPageById(Number(id));
    const page = response.value;

    if (page?.companyId) {
      setSelectedCompany({ companyId: page.companyId,
        comapanyName: page.companyName || "",
        dpCode: page.dpCode || "",
      }as unknown as Company);
    }

    return response;
  };


const handleUpdate = async (id: string, formData: Record<string, any>) => {
  if (!selectedCompany) {
    throw new Error("Please select a company");
  }
const payload = {
  mainPageId: Number(id),
  companyId: selectedCompany.companyId,
  mainText: formData.mainText?.trim() || "",
  slogan: formData.slogan?.trim() || "",
  corouselImage1: formData.corouselImage1?.trim() || "",
  corouselImage2: formData.corouselImage2?.trim() || "",
  corouselImage3: formData.corouselImage3?.trim() || "",
  
  logoImage1: formData.logoImage1?.trim() || "",
  logoImage2: formData.logoImage2?.trim() || "",
  
  contactDesc1: formData.contactDesc1?.trim() || "",
  contactDesc2: formData.contactDesc2?.trim() || "",
  
  contactLine1: formData.contactLine1?.trim() || "",
  contactLine2: formData.contactLine2?.trim() || "",
  contactLine3: formData.contactLine3?.trim() || "",
  
  phonenum: formData.phonenum?.trim() || "",
  faxnum: formData.faxnum?.trim() || "",
  website: formData.website?.trim() || "",
  email: formData.email?.trim() || "",
  
  rulesRegulation: formData.rulesRegulation?.trim() || "",
  dayQuote: formData.dayQuote?.trim() || "",
 
} as Omit<MainPage, "auditLogs">;

  await MainPageService.updateMainPage(Number(id), payload);
};
  const popupHandlers = {
    companyId: {
      value: selectedCompany?.comapanyName|| "",
      actualValue: selectedCompany?.companyId,
      onOpen: () => setShowCompanyPopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Main Page"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="mainPageId"
        navigateBackPath="/dashboard/cms/mainpage-list"
        auditLogConfig={{ tableName: "MainPage", recordIdField: "mainPageId" }}
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
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

export default MainPageEdit;
