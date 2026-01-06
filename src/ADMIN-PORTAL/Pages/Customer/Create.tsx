// src/components/Customer/CustomerCreate.tsx
import React from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { Customer } from "../../Types/Customers/Customers.types";
import CustomerService from "../../Services/Customers/Customers.services";


const CustomerCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "customerName", rules: { type: "text", label: "Customer Name", required: true, colWidth: 6 } },
    { name: "customerPhone", rules: { type: "text", label: "Phone Number", required: true, colWidth: 6 } },
    { name: "customerEmail", rules: { type: "email", label: "Email", required: true, colWidth: 6 } },
    { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 6 } },
    { name: "nationality", rules: { type: "text", label: "Nationality", colWidth: 6 } },
    { name: "customerAddress", rules: { type: "textarea", label: "Address", required: true, colWidth: 12 } },
    { name: "companyId", rules: { type: "number", label: "Company ID", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<Omit<Customer, "customerId" | "auditLogs">> = {
      customerName: formData.customerName?.trim(),
      customerPhone: formData.customerPhone?.trim(),
      customerEmail: formData.customerEmail?.trim(),
      dob: formData.dob,
      nationality: formData.nationality?.trim(),
      customerAddress: formData.customerAddress?.trim(),
      companyId: Number(formData.companyId),
      isActive: Boolean(formData.isActive),
    };

    await CustomerService.createCustomer({ customer: payload });
  };

  return (
    <KiduCreate
      title="Create Customer"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Customer"
      showResetButton
      successMessage="Customer created successfully!"
      errorMessage="Failed to create customer."
      navigateOnSuccess="/dashboard/customer-list"
      navigateDelay={1200}
      themeColor="#1B3763"
    />
  );
};

export default CustomerCreate;
