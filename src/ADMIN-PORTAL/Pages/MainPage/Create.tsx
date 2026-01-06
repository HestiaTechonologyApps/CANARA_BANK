// src/components/MainPage/MainPageCreate.tsx
import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { MainPage } from "../../Types/CMS/MainPage.types";
import MainPageService from "../../Services/CMS/MainPage.services";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const MainPageCreate: React.FC = () => {

  const[showCompanyPopup,setShowCompanyPopup]=useState(false);
  const[selectedCompany,setSelectedCompany]=useState<Company|null>(null);
 
  const fields: Field[] = [
    { name: "companyId", rules: { type: "popup", label: "Company ID", required: true, placeholder: "Enter company ID", colWidth: 4 } },

    { name: "mainText", rules: { type: "textarea", label: "Main Text", required: true, placeholder: "Main hero/intro text for the website", colWidth: 6 } },
    { name: "slogan", rules: { type: "text", label: "Slogan", required: true, minLength: 1, maxLength: 200, placeholder: "Short slogan/tagline", colWidth: 6 } },

    { name: "corouselImage1", rules: { type: "text", label: "Carousel Image 1 (URL or path)", required: false, colWidth: 4 } },
    { name: "corouselImage2", rules: { type: "text", label: "Carousel Image 2 (URL or path)", required: false, colWidth: 4 } },
    { name: "corouselImage3", rules: { type: "text", label: "Carousel Image 3 (URL or path)", required: false, colWidth: 4 } },

    { name: "logoImage1", rules: { type: "text", label: "Logo Image 1 (URL or path)", required: false, colWidth: 6 } },
    { name: "logoImage2", rules: { type: "text", label: "Logo Image 2 (URL or path)", required: false, colWidth: 6 } },

    { name: "contactDesc1", rules: { type: "text", label: "Contact Desc 1", required: false, colWidth: 6 } },
    { name: "contactDesc2", rules: { type: "text", label: "Contact Desc 2", required: false, colWidth: 6 } },

    { name: "contactLine1", rules: { type: "text", label: "Contact Line 1", required: false, colWidth: 4 } },
    { name: "contactLine2", rules: { type: "text", label: "Contact Line 2", required: false, colWidth: 4 } },
    { name: "contactLine3", rules: { type: "text", label: "Contact Line 3", required: false, colWidth: 4 } },

    { name: "phonenum", rules: { type: "text", label: "Phone", required: true, minLength: 5, maxLength: 20, placeholder: "e.g., 9876543210", colWidth: 4 } },
    { name: "faxnum", rules: { type: "text", label: "Fax Number", required: false, colWidth: 4 } },
    { name: "website", rules: { type: "text", label: "Website", required: true, placeholder: "e.g., www.example.com", colWidth: 4 } },

    { name: "email", rules: { type: "email", label: "Email", required: true, placeholder: "e.g., hello@company.com", colWidth: 4 } },
    { name: "dayQuote", rules: { type: "text", label: "Day Quote", required: false, colWidth: 6 } },

    { name: "rulesRegulation", rules: { type: "textarea", label: "Rules & Regulations", required: false, colWidth: 12 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
  if (!selectedCompany) {
    throw new Error("Please select a company");
  }

  const email = (formData.email || "").trim();
  const phone = (formData.phonenum || "").trim();

  if (!email.includes("@")) throw new Error("Please provide a valid email address.");
  if (phone.length < 5) throw new Error("Please provide a valid phone number.");

  const payload: Omit<MainPage, "mainPageId" | "auditLogs"> = {
    companyId: selectedCompany.companyId,           
    companyName: selectedCompany.comapanyName || "", 
    mainText: (formData.mainText || "").trim(),
    slogan: (formData.slogan || "").trim(),
    corouselImage1: (formData.corouselImage1 || "").trim(),
    corouselImage2: (formData.corouselImage2 || "").trim(),
    corouselImage3: (formData.corouselImage3 || "").trim(),
    logoImage1: (formData.logoImage1 || "").trim(),
    logoImage2: (formData.logoImage2 || "").trim(),
    contactDesc1: (formData.contactDesc1 || "").trim(),
    contactDesc2: (formData.contactDesc2 || "").trim(),
    contactLine1: (formData.contactLine1 || "").trim(),
    contactLine2: (formData.contactLine2 || "").trim(),
    contactLine3: (formData.contactLine3 || "").trim(),
    phonenum: phone,
    faxnum: (formData.faxnum || "").trim(),
    website: (formData.website || "").trim(),
    email,
    rulesRegulation: (formData.rulesRegulation || "").trim(),
    dayQuote: (formData.dayQuote || "").trim(),
  };

  await MainPageService.createMainPage(payload);
};

const popupHandlers = {
  companyId: {
    value: selectedCompany?.comapanyName || "",  
    actualValue: selectedCompany?.companyId,    
    onOpen: () => setShowCompanyPopup(true),
  }
}
  return (
  <>
      <KiduCreate
        title="Create Main Page"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Main Page"
        showResetButton
        successMessage="Main page created successfully!"
        errorMessage="Failed to create main page. Please check the details and try again."
        navigateOnSuccess="/dashboard/cms/mainpage-list"
        navigateDelay={1200}
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
      />
      <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={setSelectedCompany}
      />
  </>
  );
};

export default MainPageCreate;
