import React from "react";
import AttachmentService from "../../../Services/Attachment.services";
import type { ViewField } from "../../Components/KiduView";
import KiduView from "../../Components/KiduView";

const AttachmentView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "attachmentId", label: "Attachment ID", icon: "bi-hash" },
    { key: "fileName", label: "File Name", icon: "bi-file-earmark" },
    { key: "description", label: "Description", icon: "bi-card-text" },
    { key: "tableName", label: "Table Name", icon: "bi-table" },
    { key: "recordId", label: "Record ID", icon: "bi-123" },
  ];

  const handleFetch = async (id: string) => {
    return AttachmentService.getById(Number(id));
  };

  const handleDelete = async (id: string) => {
    await AttachmentService.deleteAttachment(Number(id), "admin");
  };

  return (
    <KiduView
      title="Attachment Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="attachmentId"
      listRoute="/dashboard/cms/attachments-list"
      editRoute="/dashboard/cms/attachments-edit"
      auditLogConfig={{ tableName: "Attachment", recordIdField: "attachmentId", }}
      themeColor="#1B3763"
      loadingText="Loading attachment details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this attachment?"
    />
  );
};

export default AttachmentView;
