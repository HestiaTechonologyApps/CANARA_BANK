import React from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import AttachmentService from "../../../Services/Attachment.services";

const AttachmentEdit: React.FC = () => {

  const fields: Field[] = [
    { name: "fileName", rules: { type: "text", label:"Current File", required: false, colWidth: 6, disabled: true }, },
    {
      name: "file", rules: { type: "file", label: "Upload New File (Optional)", required: false, colWidth: 6, }, },
    {
      name: "description",
      rules: {
        type: "text",
        label: "Description",
        required: true, colWidth: 6, }, },
  ];

  const handleFetch = async (id: string) => {
    const response = await AttachmentService.getById(Number(id));

    return {
      ...response,
      value: {
        ...response.value,
        fileName: response.value.fileName || "No file uploaded",
      },
    };
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload = {
      attachmentId: Number(id),
      description: formData.description,
      tableName: formData.tableName,
      recordID: formData.recordId || 0,
      fileName: formData.fileName,
      filePath: formData.filePath,
      fileSize: formData.fileSize,
      fileType: formData.fileType,
    };

    await AttachmentService.updateAttachment(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Attachment"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      paramName="attachmentId"
      submitButtonText="Update Attachment"
      showResetButton
      successMessage="Attachment updated successfully!"
      errorMessage="Failed to update attachment."
      navigateBackPath="/dashboard/cms/attachments-list"
      auditLogConfig={{
        tableName: "Attachment",
        recordIdField: "attachmentId",
      }}
      themeColor="#1B3763"
    />
  );
};

export default AttachmentEdit;