import React from "react";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import AttachmentService from "../../../Services/Attachment.services";
import type { Attachment } from "../../../Types/Attachment.types";

const DocumentList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async (): Promise<Attachment[]> => {
        return (await AttachmentService.getByTableAndId(
          "public",
          0
        )) as unknown as Attachment[];
      }}

      columns={[
        { key: "attachmentId", label: "ID", enableSorting: true, type: "text" },
        { key: "fileName", label: "File Name", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: true, type: "text" },
      ]}

      idKey="attachmentId"
      title="Documents"
      subtitle="Manage documents uploaded"
      addButtonLabel="Add document"
      addRoute="/dashboard/cms/documents-create"
      editRoute="/dashboard/cms/documents-edit"
      viewRoute="/dashboard/cms/documents-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default DocumentList;
