// src/components/MainPage/MainPageEdit.tsx
import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { MainPage } from "../../Types/CMS/MainPage.types";
import MainPageService from "../../Services/CMS/MainPage.services";

const MainPageEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "mainPageId",
      rules: {
        type: "number",
        label: "Main Page ID",
        required: false,
        disabled: true,
        colWidth: 3,
      },
    },
    {
      name: "companyId",
      rules: {
        type: "number",
        label: "Company ID",
        required: true,
        colWidth: 3,
      },
    },
    {
      name: "companyName",
      rules: {
        type: "text",
        label: "Company Name",
        required: true,
        minLength: 2,
        maxLength: 150,
        colWidth: 6,
      },
    },

    {
      name: "mainText",
      rules: {
        type: "textarea",
        label: "Main Text",
        required: true,
        colWidth: 12,
      },
    },
    {
      name: "slogan",
      rules: {
        type: "text",
        label: "Slogan",
        required: true,
        minLength: 1,
        maxLength: 200,
        colWidth: 12,
      },
    },

    {
      name: "corouselImage1",
      rules: {
        type: "text",
        label: "Carousel Image 1 (URL/path)",
        required: false,
        colWidth: 4,
      },
    },
    {
      name: "corouselImage2",
      rules: {
        type: "text",
        label: "Carousel Image 2 (URL/path)",
        required: false,
        colWidth: 4,
      },
    },
    {
      name: "corouselImage3",
      rules: {
        type: "text",
        label: "Carousel Image 3 (URL/path)",
        required: false,
        colWidth: 4,
      },
    },

    {
      name: "logoImage1",
      rules: {
        type: "text",
        label: "Logo Image 1 (URL/path)",
        required: false,
        colWidth: 6,
      },
    },
    {
      name: "logoImage2",
      rules: {
        type: "text",
        label: "Logo Image 2 (URL/path)",
        required: false,
        colWidth: 6,
      },
    },

    {
      name: "contactDesc1",
      rules: {
        type: "text",
        label: "Contact Desc 1",
        required: false,
        colWidth: 6,
      },
    },
    {
      name: "contactDesc2",
      rules: {
        type: "text",
        label: "Contact Desc 2",
        required: false,
        colWidth: 6,
      },
    },

    {
      name: "contactLine1",
      rules: {
        type: "text",
        label: "Contact Line 1",
        required: false,
        colWidth: 4,
      },
    },
    {
      name: "contactLine2",
      rules: {
        type: "text",
        label: "Contact Line 2",
        required: false,
        colWidth: 4,
      },
    },
    {
      name: "contactLine3",
      rules: {
        type: "text",
        label: "Contact Line 3",
        required: false,
        colWidth: 4,
      },
    },

    {
      name: "phonenum",
      rules: {
        type: "text",
        label: "Phone",
        required: true,
        minLength: 5,
        maxLength: 20,
        colWidth: 4,
      },
    },
    {
      name: "faxnum",
      rules: {
        type: "text",
        label: "Fax Number",
        required: false,
        colWidth: 4,
      },
    },
    {
      name: "website",
      rules: {
        type: "text",
        label: "Website",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "email",
      rules: {
        type: "email",
        label: "Email",
        required: true,
        colWidth: 4,
      },
    },

    {
      name: "rulesRegulation",
      rules: {
        type: "textarea",
        label: "Rules & Regulations",
        required: false,
        colWidth: 12,
      },
    },
    {
      name: "dayQuote",
      rules: {
        type: "text",
        label: "Day Quote",
        required: false,
        colWidth: 12,
      },
    },
  ];

  // Service getById returns the entity directly (not CustomResponse).
  // If your KiduEdit expects { value }, wrap it like below.
const handleFetch = async (mainPageId: string) => {   try {     const response = await MainPageService.getMainPageById(Number(mainPageId));    return response; // Now returns CustomResponse<MainPage>  
  } catch (error: any) {     console.error("Error fetching main page:", error);     throw error;   } };
 

  const handleUpdate = async (mainPageId: string, formData: Record<string, any>) => {
    const email = (formData.email || "").trim();
    const phone = (formData.phonenum || "").trim();
    if (!email.includes("@")) throw new Error("Please provide a valid email address.");
    if (phone.length < 5) throw new Error("Please provide a valid phone number.");

    const payload: Omit<MainPage, "auditLogs"> = {
      mainPageId: Number(mainPageId),
      companyId: Number(formData.companyId),
      companyName: (formData.companyName || "").trim(),
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

    await MainPageService.updateMainPage(Number(mainPageId), payload);
  };

  return (
    <KiduEdit
      title="Edit Main Page"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Main Page"
      showResetButton
      successMessage="Main page updated successfully!"
      errorMessage="Failed to update main page. Please try again."
      paramName="mainPageId"
      navigateBackPath="/dashboard/cms/mainpage-list"
      loadingText="Loading Main Page..."
      auditLogConfig={{
        tableName: "MainPage",
        recordIdField: "mainPageId",
      }}
      themeColor="#18575A"
    />
  );
};

export default MainPageEdit;
