import React from "react";
import SupportTicketService from "../../Services/SupportTicket/SupportTicket.services";
import KiduServerTableList from "../../../Components/KiduServerTableList";

const SupportTicketList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => await SupportTicketService.getAllSupportTickets()}
      columns={[
        { key: "supportTicketId", label: "Support TicketID", enableSorting: true, type: "text" },
        { key: "supportTicketNum", label: "Ticket No", enableSorting: true, type: "text" },
        { key: "priority", label: "Priority", enableSorting: true, type: "text" },
        { key: "duration", label: "Duration", enableSorting: true, type: "text" },
        { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" },
      ]}
      filterColumns={[
        { key: "supportTicketId", label: "Support TicketID", type: "text" },
        { key: "supportTicketNum", label: "Ticket No", type: "text" },
        { key: "priority", label: "Priority", type: "text" },
        { key: "duration", label: "Duration", type: "text" },
      ]}
      
      idKey="supportTicketId"
      title="Support Tickets"
      subtitle="Manage support tickets with search, filter, and pagination."
      addButtonLabel="Add Ticket"
      addRoute="/dashboard/supportTickets-create"
      editRoute="/dashboard/supportTickets-edit"
      viewRoute="/dashboard/supportTickets-view"
      showAddButton
      showExport
      showSearch
      showActions
      rowsPerPage={10}
    />
  );
};

export default SupportTicketList;
