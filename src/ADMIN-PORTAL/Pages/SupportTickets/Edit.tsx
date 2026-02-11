import React from "react";
import type { Field } from "../../Components/KiduEdit";
import SupportTicketService from "../../Services/SupportTicket/SupportTicket.services";
import type { SupportTicket } from "../../Types/SupportTicket/SupportTicket.types";
import KiduEdit from "../../Components/KiduEdit";

const SupportTicketEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "supportTicketNum", rules: { type: "text", label: "Ticket Number", required: true, colWidth: 4 } },
    { name: "priority", rules: { type: "select", label: "Priority", required: true, colWidth: 4 } },
    { name: "duration", rules: { type: "text", label: "Duration", required: true, colWidth: 4 } },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, colWidth: 6 } },
    { name: "developerRemark", rules: { type: "textarea", label: "Developer Remark", colWidth: 6 } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
  ];

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" },
  ];

  const handleFetch = async (id: string) =>
    await SupportTicketService.getSupportTicketById(Number(id));

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Omit<SupportTicket, "auditLogs"> = {
      supportTicketId: Number(id),
      supportTicketNum: formData.supportTicketNum,
      priority: formData.priority,
      duration: formData.duration,
      description: formData.description,
      developerRemark: formData.developerRemark || "",
      isApproved: Boolean(formData.isApproved),
      approvedByUserId: formData.approvedByUserId,
      approvedDate: formData.approvedDate,
      approvedDateSting: formData.approvedDateSting,
    };
    await SupportTicketService.updateSupportTicket(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Support Ticket"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Ticket"
      showResetButton
      successMessage="Support ticket updated successfully!"
      errorMessage="Failed to update support ticket."
      paramName="supportTicketId"
      navigateBackPath="/dashboard/supportTickets-list"
      auditLogConfig={{ tableName: "SupportTicket", recordIdField: "supportTicketId" }}
      themeColor="#1B3763"
      options={{ priority: priorityOptions, }}
    />
  );
};

export default SupportTicketEdit;
