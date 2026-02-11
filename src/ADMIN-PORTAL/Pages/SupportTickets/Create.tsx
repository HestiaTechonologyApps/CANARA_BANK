import React, { useState } from "react";
import type { Field } from "../../Components/KiduCreate";
import type { SupportTicket } from "../../Types/SupportTicket/SupportTicket.types";
import SupportTicketService from "../../Services/SupportTicket/SupportTicket.services";
import KiduCreate from "../../Components/KiduCreate";

const SupportTicketCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const payload: Omit<SupportTicket, "supportTicketId" | "auditLogs"> = {
        supportTicketNum: formData.supportTicketNum,
        priority: formData.priority,
        duration: formData.duration,
        description: formData.description,
        developerRemark: formData.developerRemark || "",
        isApproved: Boolean(formData.isApproved),
      };

      await SupportTicketService.createSupportTicket(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Support Ticket"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Ticket"
      showResetButton
      loadingState={isLoading}
      successMessage="Support ticket created successfully!"
      errorMessage="Failed to create support ticket."
      navigateOnSuccess="/dashboard/supportTickets-list"
      themeColor="#1B3763"
      options={{ priority: priorityOptions, }}
    />
  );
};

export default SupportTicketCreate;
