// src/components/CMS/DocumentEdit.tsx
import React from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import AttachmentService from "../../../Services/Attachment.services";

const DocumentEdit: React.FC = () => {

  const fields: Field[] = [
    { name: "file", rules: { type: "file", label: "File", required: true, colWidth: 6 } },
    { name: "description", rules: { type: "text", label: "Description", required: true, colWidth: 6 } },
  ];

  const handleFetch = async (id: string) => {
   const response = await AttachmentService.getById(Number(id));
return response; // ✅ same as MemberEdit

  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const formDataPayload = new FormData();

    if (formData.file) {
      formDataPayload.append("file", formData.file);
    }

    formDataPayload.append("description", formData.description);
    formDataPayload.append("tableName", "public");
    formDataPayload.append("recordId", "0");

    await AttachmentService.updateAttachment(Number(id), formDataPayload as any);
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
