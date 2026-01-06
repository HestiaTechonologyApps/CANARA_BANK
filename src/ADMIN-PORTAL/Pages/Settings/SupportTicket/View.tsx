// src/components/SupportTicket/SupportTicketView.tsx

import React from "react";
import KiduView from "../../../Components/KiduView";
import type { ViewField } from "../../../Components/KiduView";
import SupportTicketService from "../../../Services/Settings/SupportTicket.services";

const fields: ViewField[] = [
  { key: "supportTicketNum", label: "Ticket Number", icon: "bi-hash" },
  { key: "description", label: "Description", icon: "bi-chat-text" },
  { key: "priority", label: "Priority", icon: "bi-exclamation-circle" },
  { key: "duration", label: "Duration", icon: "bi-clock" },
  { key: "developerRemark", label: "Developer Remark", icon: "bi-code-slash" },
  { key: "isApproved", label: "Approved", icon: "bi-check-circle", isBoolean: true },
  { key: "approvedByUserId", label: "Approved By", icon: "bi-person-check" },
  { key: "approvedDateSting", label: "Approved Date", icon: "bi-calendar-check" },
];

const SupportTicketView: React.FC = () => {
  const handleFetch = async (id: string) =>
    SupportTicketService.getSupportTicketById(Number(id));

  const handleDelete = async (id: string) =>
    SupportTicketService.deleteSupportTicket(Number(id));

  return (
    <KiduView
      title="Support Ticket Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/support-ticket/support-ticket-edit"
      listRoute="/dashboard/support-ticket/support-ticket-list"
      paramName="supportTicketId"
      auditLogConfig={{
        tableName: "SupportTicket",
        recordIdField: "supportTicketId",
      }}
      themeColor="#1B3763"
    />
  );
};

export default SupportTicketView;
