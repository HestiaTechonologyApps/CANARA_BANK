// src/components/SupportTicket/SupportTicketCreate.tsx

import React, { useState } from "react";
import KiduCreate from "../../../Components/KiduCreate";
import type { Field } from "../../../Components/KiduCreate";
import SupportTicketService from "../../../Services/Settings/SupportTicket.services";
import type { SupportTicket } from "../../../Types/Settings/SupportTicket.types";

const SupportTicketCreate: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const fields: Field[] = [
    {
      name: "description",
      rules: {
        type: "textarea",
        label: "Issue Description",
        required: true,
        colWidth: 12,
      },
    },
    {
      name: "priority",
      rules: {
        type: "text",
        label: "Priority",
        placeholder: "Low / Medium / High",
        required: true,
        colWidth: 4,
      },
    },
    {
      name: "duration",
      rules: {
        type: "text",
        label: "Expected Duration",
        placeholder: "e.g. 2 hours",
        required: true,
        colWidth: 4,
      },
    },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setLoading(true);
    try {
      const payload: Omit<SupportTicket, "supportTicketId" | "auditLogs"> = {
        supportTicketNum: "",
        description: formData.description,
        priority: formData.priority,
        duration: formData.duration,
        developerRemark: "",
        isApproved: false,
      };

      await SupportTicketService.createSupportTicket(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Support Ticket"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Raise Ticket"
      loadingState={loading}
      successMessage="Support ticket created successfully!"
      errorMessage="Failed to create support ticket"
      navigateOnSuccess="/dashboard/support-ticket/support-ticket-list"
      themeColor="#1B3763"
    />
  );
};

export default SupportTicketCreate;
