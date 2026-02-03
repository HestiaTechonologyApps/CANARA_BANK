// src/components/CMS/DayQuoteCreate.tsx
import React from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import AttachmentService from "../../../Services/Attachment.services";

const DocumentCreate: React.FC = () => {
 
  const fields: Field[] = [
    { name: "file", rules: { type: "file", label: "File", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "text", label: "Description", required: true, colWidth: 6 } }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
  const formDataPayload = new FormData();

  formDataPayload.append("file", formData.file); // File object
  formDataPayload.append("tableName", "public");
  formDataPayload.append("recordId", "0");
  formDataPayload.append("description", formData.description);

  await AttachmentService.uploadAttachment(formDataPayload);
};

  return (
    <>
      <KiduCreate
        title="Upload document"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Upload Document"
        showResetButton
        successMessage="Document uploaded successfully!"
        errorMessage="Failed to upload document. Please try again."
        navigateOnSuccess="/dashboard/cms/documents-list"
         navigateDelay={1500}
        themeColor="#1B3763"
      />
    </>
  );
};

export default DocumentCreate;
