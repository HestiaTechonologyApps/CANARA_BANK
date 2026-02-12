import React from "react";
import type { ViewField } from "../../Components/KiduView";
import SupportTicketService from "../../Services/SupportTicket/SupportTicket.services";
import KiduView from "../../Components/KiduView";

const SupportTicketView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "supportTicketId", label: "Ticket ID", icon: "bi-hash" },
    { key: "supportTicketNum", label: "Ticket Number", icon: "bi-ticket-perforated" },
    { key: "priority", label: "Priority", icon: "bi-exclamation-circle" },
    { key: "duration", label: "Duration", icon: "bi-clock" },
    { key: "description", label: "Description", icon: "bi-file-text" },
    { key: "developerRemark", label: "Developer Remark", icon: "bi-chat-left-text" },
    { key: "isApproved", label: "Approved", icon: "bi-check-circle", isBoolean: true },
    { key: "approvedDateString", label: "Approved Date", icon: "bi-calendar-check" },
  ];

  const formatDateOnly = (value?: string | Date | null) => {
    if (!value) return "N/A";

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN");
  };

  const handleFetch = async (id: string) => {
    const response = await SupportTicketService.getSupportTicketById(Number(id));

    if (response?.value) {
      response.value.approvedDateString = formatDateOnly(
        response.value.approvedDateString
      );
    }

    return response;
  };

  const handleDelete = async (id: string) =>
    await SupportTicketService.deleteSupportTicket(Number(id));

  return (
    <KiduView
      title="Support Ticket Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/supportTickets-edit"
      listRoute="/dashboard/supportTickets-list"
      paramName="supportTicketId"
      auditLogConfig={{ tableName: "SupportTicket", recordIdField: "supportTicketId" }}
      themeColor="#1B3763"
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this support ticket? This action cannot be undone."
    />
  );
};

export default SupportTicketView;