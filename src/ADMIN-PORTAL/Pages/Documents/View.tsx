// src/components/CMS/DocumentView.tsx
import React from "react";
import AttachmentService from "../../../Services/Attachment.services";
import type { ViewField } from "../../Components/KiduView";
import KiduView from "../../Components/KiduView";

const DocumentView: React.FC = () => {

  const fields: ViewField[] = [
    { key: "attachmentId", label: "Attachment ID", icon: "bi-hash" },
    { key: "fileName", label: "File Name", icon: "bi-file-earmark" },
    { key: "description", label: "Description", icon: "bi-card-text" },
    { key: "tableName", label: "Table Name", icon: "bi-table" },
    { key: "recordId", label: "Record ID", icon: "bi-123" },
  ];

  const handleFetch = async (id: string) => {
   const response = await AttachmentService.getById(Number(id));
return response;

  };

  const handleDelete = async (id: string) => {
    await AttachmentService.deleteAttachment(Number(id), "admin");
  };

  return (
    <KiduView
      title="Document Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="attachmentId"
      listRoute="/dashboard/cms/documents-list"
      editRoute="/dashboard/cms/documents-edit"
      auditLogConfig={{
        tableName: "Attachment",
        recordIdField: "attachmentId",
      }}
      themeColor="#1B3763"
      loadingText="Loading document details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this document?"
    />
  );
};

export default DocumentView;
