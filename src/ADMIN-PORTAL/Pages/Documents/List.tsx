// src/components/CMS/DayQuoteList.tsx
import React from "react";
import KiduServerTable from "../../../Components/KiduServerTable";
import AttachmentService from "../../../Services/Attachment.services";
import type { Attachment } from "../../../Types/Attachment.types";

const columns = [
  { key: "attachmentId", label: "ID", type: "text" as const },
  { key: "fileName", label: "File Name", type: "text" as const },
  { key: "description", label: "Description", type: "text" as const },
];

const DocumentList: React.FC = () => {
  const fetchData = async (_params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: Attachment[]; total: number }> => {
    const attachments = await AttachmentService.getByTableAndId(
      "public", // tableName
      0         // recordId
    );
    return {
      data: attachments as unknown as Attachment[],
      total: attachments.length,
    };
  };

  return (
    <KiduServerTable
      title="Documents"
      subtitle="Manage documents uploaded"
      columns={columns}
      idKey="attachmentId"
      addButtonLabel="Add document"
      addRoute="/dashboard/cms/document-create"
      editRoute="/dashboard/cms/document-edit"
      viewRoute="/dashboard/cms/document-view"
      showAddButton
      showExport
      showSearch
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default DocumentList;
