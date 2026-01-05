// src/components/Customer/CustomerView.tsx

import React from "react";
import type { ViewField } from "../../Components/KiduView";
import CustomerService from "../../Services/Customers/Customers.services";
import KiduView from "../../Components/KiduView";

const CustomerView: React.FC = () => {

  const fields: ViewField[] = [
    { key: "customerId", label: "Customer ID", icon: "bi-hash" },
    { key: "customerName", label: "Customer Name", icon: "bi-person" },
    { key: "customerEmail", label: "Email", icon: "bi-envelope" },
    { key: "customerPhone", label: "Phone", icon: "bi-telephone" },
    { key: "dob", label: "Date of Birth", icon: "bi-calendar" },
    { key: "nationalilty", label: "Nationality", icon: "bi-flag" },
    { key: "customerAddress", label: "Address", icon: "bi-geo-alt" },
    { key: "isActive", label: "Active", icon: "bi-check-circle" },
    { key: "isDeleted", label: "Deleted", icon: "bi-x-circle" },
  ];

  const handleFetch = async (customerId: string) => {
    const response = await CustomerService.getCustomerById(Number(customerId));
    return response;
  };

  const handleDelete = async (customerId: string) => {
    await CustomerService.deleteCustomer(Number(customerId));
  };

  return (
    <KiduView
      title="Customer Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/customer-edit"
      listRoute="/dashboard/customer-list"
      paramName="customerId"
      auditLogConfig={{
        tableName: "Customer",
        recordIdField: "customerId",
      }}
      themeColor="#18575A"
      loadingText="Loading customer details..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this customer?"
    />
  );
};

export default CustomerView;
