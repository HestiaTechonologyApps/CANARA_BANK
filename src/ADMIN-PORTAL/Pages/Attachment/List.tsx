import React from "react";
import KiduServerTableList from "../../../Components/KiduServerTableList";
import AttachmentService from "../../../Services/Attachment.services";
import type { Attachment } from "../../../Types/Attachment.types";

const AttachmentList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async (): Promise<Attachment[]> => {
        return (await AttachmentService.getByTableAndId(
          "public",
          0
        )) as Attachment[];
      }}

      columns={[
        { key: "attachmentId", label: "ID", enableSorting: true, type: "text" },
        { key: "fileName", label: "File Name", enableSorting: true, type: "text" },
        { key: "description", label: "Description", enableSorting: true, type: "text" },
      ]}

      idKey="attachmentId"
      title="Attachments"
      subtitle="Manage attachments uploaded"
      addButtonLabel="Add Attachment"
      addRoute="/dashboard/cms/attachments-create"
      editRoute="/dashboard/cms/attachments-edit"
      viewRoute="/dashboard/cms/attachments-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default AttachmentList;
