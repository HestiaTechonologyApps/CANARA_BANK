// src/ADMIN-PORTAL/Pages/Support/SupportTicketList.tsx

import React from "react";
import type { SupportTicket } from "../../Types/Settings/SupportTicket.types";
import SupportTicketService from "../../Services/Settings/SupportTicket.services";
import KiduServerTable from "../../../Components/KiduServerTable";

const columns = [
  { key: "supportTicketId", label: "Support TicketID", enableSorting: true, type: "text" as const },
  { key: "supportTicketNum", label: "Ticket No", enableSorting: true, type: "text" as const },
  { key: "priority", label: "Priority", enableSorting: true, type: "text" as const },
  { key: "duration", label: "Duration", enableSorting: true, type: "text" as const },
  { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" as const },
];

const SupportTicketList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: SupportTicket[]; total: number }> => {
    const tickets = await SupportTicketService.getAllSupportTickets();

    let filtered = tickets;
    if (params.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      filtered = tickets.filter((t) =>
        [
          t.supportTicketNum,
          t.priority,
          t.duration,
          t.description,
        ]
          .map(String)
          .some((v) => v.toLowerCase().includes(q))
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    return {
      data: filtered.slice(start, start + params.pageSize),
      total: filtered.length,
    };
  };

  return (
    <KiduServerTable
      title="Support Tickets"
      subtitle="Manage support tickets with search, filter, and pagination."
      columns={columns}
      idKey="supportTicketId"
      addButtonLabel="Add Ticket"
      addRoute="/dashboard/supportTickets-create"
      editRoute="/dashboard/supportTickets-edit"
      viewRoute="/dashboard/supportTickets-view"
      fetchData={fetchData}
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      rowsPerPage={10}
    />
  );
};

export default SupportTicketList;
