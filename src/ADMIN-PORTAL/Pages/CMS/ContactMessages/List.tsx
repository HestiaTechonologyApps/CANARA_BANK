import React from "react";
import ContactMessageService from "../../../Services/CMS/ContactMessages.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const ContactMessageList: React.FC = () => {
  return (
    <KiduServerTableList

      fetchService={ContactMessageService.getAllContactMessages}

      columns={[
        { key: "contactMessageId", label: "ID", enableSorting: true, type: "text" },
        { key: "fullName", label: "Full Name", enableSorting: true, type: "text" },
        { key: "emailAddress", label: "Email", enableSorting: true, type: "text" },
        { key: "phoneNumber", label: "Phone", enableSorting: true, type: "text" },
        { key: "subject", label: "Subject", enableSorting: true, type: "text" },
        { key: "submittedAt", label: "Submitted At", enableSorting: true, type: "date" },
        { key: "isRead", label: "Read", enableSorting: true, type: "checkbox" },
        { key: "isReplied", label: "Replied", enableSorting: true, type: "checkbox" },
      ]}

      filterColumns={[
        { key: "contactMessageId", label: "ID", type: "text" },
        { key: "fullName", label: "Full Name", type: "text" },
        { key: "emailAddress", label: "Email", type: "text" },
        { key: "phoneNumber", label: "Phone", type: "text" },
        { key: "subject", label: "Subject", type: "text" },
        { key: "submittedAt", label: "Submitted At", type: "date" },
      ]}
      
      idKey="contactMessageId"
      title="Contact Messages"
      subtitle="Manage customer contact enquiries with search, filter, and pagination."
      viewRoute="/dashboard/cms/ContactMessage-view"
      // No editRoute - only view button will show
      showAddButton={false}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default ContactMessageList;