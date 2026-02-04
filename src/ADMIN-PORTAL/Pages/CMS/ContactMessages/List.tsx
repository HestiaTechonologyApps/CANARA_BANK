import React from "react";
import ContactMessageService from "../../../Services/CMS/ContactMessages.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const ContactMessageList: React.FC = () => {
  return (
    <KiduServerTableList
      /* ================= DATA FETCH ================= */
      fetchService={ContactMessageService.getAllContactMessages}

      /* ================= TABLE CONFIG ================= */
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

      /* ================= KEYS ================= */
      idKey="contactMessageId"

      /* ================= UI ================= */
      title="Contact Messages"
      subtitle="Manage customer contact enquiries with search, filter, and pagination."

      /* ================= ROUTES ================= */
      viewRoute="/dashboard/cms/ContactMessage-view"
      // No editRoute - only view button will show

      /* ================= FEATURES ================= */
      showAddButton={false}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default ContactMessageList;