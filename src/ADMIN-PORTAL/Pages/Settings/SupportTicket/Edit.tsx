// src/components/SupportTicket/SupportTicketEdit.tsx

import React from "react";
import KiduEdit from "../../../Components/KiduEdit";
import type { Field } from "../../../Components/KiduEdit";
import SupportTicketService from "../../../Services/Settings/SupportTicket.services";
import type { SupportTicket } from "../../../Types/Settings/SupportTicket.types";

const SupportTicketEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "supportTicketId",
      rules: { type: "number", label: "Ticket ID", disabled: true, colWidth: 3 },
    },
    {
      name: "supportTicketNum",
      rules: { type: "text", label: "Ticket Number", disabled: true, colWidth: 3 },
    },
    {
      name: "description",
      rules: {
        type: "textarea",
        label: "Description",
        required: true,
        colWidth: 12,
      },
    },
    {
      name: "priority",
      rules: {
        type: "text",
        label: "Priority",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "duration",
      rules: {
        type: "text",
        label: "Duration",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "developerRemark",
      rules: {
        type: "textarea",
        label: "Developer Remark",
        colWidth: 12,
      },
    },
    {
      name: "isApproved",
      rules: {
        type: "toggle",
        label: "Approved",
      },
    },
  ];

  const handleFetch = async (id: string) =>
    SupportTicketService.getSupportTicketById(Number(id));

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Partial<Omit<SupportTicket, "auditLogs">> = {
      description: formData.description,
      priority: formData.priority,
      duration: formData.duration,
      developerRemark: formData.developerRemark,
      isApproved: Boolean(formData.isApproved),
      approvedByUserId: formData.isApproved ? 1 : undefined,
      approvedDate: formData.isApproved ? new Date().toISOString() : undefined,
      approvedDateSting: formData.isApproved
        ? new Date().toISOString()
        : undefined,
    };

    await SupportTicketService.updateSupportTicket(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Support Ticket"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      paramName="supportTicketId"
      navigateBackPath="/dashboard/support-ticket/support-ticket-list"
      successMessage="Support ticket updated successfully!"
      errorMessage="Failed to update support ticket"
      auditLogConfig={{
        tableName: "SupportTicket",
        recordIdField: "supportTicketId",
      }}
      themeColor="#1B3763"
    />
  );
};

export default SupportTicketEdit;
