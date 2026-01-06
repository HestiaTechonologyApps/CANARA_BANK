// src/components/Customer/CustomerView.tsx
import React from "react";
import KiduView from "../../Components/KiduView";
import type { ViewField } from "../../Components/KiduView";
import CustomerService from "../../Services/Customers/Customers.services";


const CustomerView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "customerId", label: "Customer ID", icon: "bi-hash" },
    { key: "customerName", label: "Customer Name", icon: "bi-person" },
    { key: "customerPhone", label: "Phone", icon: "bi-telephone" },
    { key: "customerEmail", label: "Email", icon: "bi-envelope" },
    { key: "dob", label: "Date of Birth", icon: "bi-calendar" },
    { key: "nationality", label: "Nationality", icon: "bi-flag" },
    { key: "customerAddress", label: "Address", icon: "bi-geo-alt" },
    { key: "companyId", label: "Company ID", icon: "bi-building" },
    { key: "isActive", label: "Active", icon: "bi-check-circle", isBoolean: true },
  ];

  const handleFetch = async (id: string) => {
    return CustomerService.getCustomerById(Number(id));
  };

  const handleDelete = async (id: string) => {
    await CustomerService.deleteCustomer(Number(id));
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
      themeColor="#1B3763"
      showEditButton
      showDeleteButton
      deleteConfirmMessage="Are you sure you want to delete this customer?"
    />
  );
};

export default CustomerView;
