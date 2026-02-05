// src/components/CMS/DocumentEdit.tsx
import React from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import AttachmentService from "../../../Services/Attachment.services";

const DocumentEdit: React.FC = () => {

  const fields: Field[] = [
    { 
      name: "fileName", 
      rules: { 
        type: "text", 
        label: "Current File", 
        required: false, 
        colWidth: 6,
        disabled: true  // Make it read-only to show existing file name
      } 
    },
    { 
      name: "file", 
      rules: { 
        type: "file", 
        label: "Upload New File (Optional)", 
        required: false,  // Changed to false - only required if uploading new file
        colWidth: 6 
      } 
    },
    { 
      name: "description", 
      rules: { 
        type: "text", 
        label: "Description", 
        required: true, 
        colWidth: 6 
      } 
    },
  ];

  const handleFetch = async (id: string) => {
    const response = await AttachmentService.getById(Number(id));
    // Add the current file name to the response so it displays in the form
    return {
      ...response,
      currentFileName: response.value.fileName || "No file uploaded"
    };
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const formDataPayload = new FormData();

    // Only append file if a new one was uploaded
    if (formData.file) {
      formDataPayload.append("file", formData.file);
    }

    formDataPayload.append("description", formData.description);
    formDataPayload.append("tableName", "public");
    formDataPayload.append("recordId", "0");

    const response =await AttachmentService.updateAttachment(Number(id), formDataPayload as any);
    console.log(response);
    
  };

  return (
    <KiduEdit
      title="Edit Document"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      paramName="attachmentId"
      submitButtonText="Update Document"
      showResetButton
      successMessage="Document updated successfully!"
      errorMessage="Failed to update document."
      navigateBackPath="/dashboard/cms/documents-list"
      auditLogConfig={{
        tableName: "Attachment",
        recordIdField: "attachmentId",
      }}
      themeColor="#1B3763"
    />
  );
};

export default DocumentEdit;