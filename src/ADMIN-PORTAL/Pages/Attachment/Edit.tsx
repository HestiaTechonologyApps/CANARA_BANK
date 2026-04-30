import React from "react";
import type { Field } from "../../Components/KiduEdit";
import KiduEdit from "../../Components/KiduEdit";
import AttachmentService from "../../../Services/Attachment.services";

const AttachmentEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "fileName", rules: { type: "text", label:"Current File", required: false, colWidth: 6, disabled: true }, },
    { name: "file", rules: { type: "file", label: "Upload New File (Optional)", required: false, colWidth: 6, }, },
    { name: "description", rules: { type: "text", label: "Description", required: true, colWidth: 6, }, },
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
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  const actualFile = fileInput?.files?.[0];

  let filePath = formData.filePath || "";
  let fileName = formData.fileName || "";
  let fileSize = formData.fileSize || "";
  let fileType = formData.fileType || "";

  if (actualFile) {
    // ── Upload new file with TableName and RecordId matching the EXISTING record ──
    const fd = new FormData();
    fd.append("File",        actualFile);
    fd.append("TableName",   formData.tableName || "public");
    fd.append("RecordId",    formData.recordId?.toString() || "0");
    fd.append("Description", formData.description || "");

    const uploadRes: any = await AttachmentService.uploadAttachment(fd);
    const uploaded = uploadRes?.value ?? uploadRes;
    console.log("⬆️ Upload response:", JSON.stringify(uploaded));

    // Get new file details from upload response
    filePath = uploaded?.filePath  || uploaded?.attachmentPath || 
               uploaded?.FilePath  || uploaded?.path           || filePath;
    fileName = uploaded?.fileName  || uploaded?.FileName       || actualFile.name;
    fileSize = uploaded?.fileSize  || uploaded?.FileSize       || String(actualFile.size);
    fileType = uploaded?.fileType  || uploaded?.FileType       || actualFile.type;

    const newId = uploaded?.attachmentId || uploaded?.id;
    if (newId && newId !== Number(id)) {
      try {
        await AttachmentService.deleteAttachment(newId, formData.uploadedBy || "system");
        console.log("🗑️ Deleted newly created duplicate record:", newId);
      } catch (e) {
        console.warn("Could not delete new record:", e);
      }
    }
  }

  // ── Always update the ORIGINAL record with new or existing file details ──
  const payload = {
    attachmentId:   Number(id),
    description:    formData.description,
    tableName:      formData.tableName   || "public",
    recordID:       formData.recordId    || 0,
    fileName:       fileName,
    filePath:       filePath,
    fileSize:       String(fileSize),
    fileType:       fileType,
    attachmentPath: filePath,
    attachmentType: fileType,
    uploadedBy:     formData.uploadedBy  || "",
    uploaddedOn:    formData.uploaddedOn || new Date().toISOString(),
    isDeleted:      false,
  };

  console.log("📤 Updating original record:", id, payload);
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
      // auditLogConfig={{
      //   tableName: "Attachment",
      //   recordIdField: "attachmentId",
      // }}
      themeColor="#1B3763"
    />
  );
};

export default AttachmentEdit;