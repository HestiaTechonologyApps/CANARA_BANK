// src/components/Customer/CustomerCreate.tsx
import React from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import CustomerService from "../../Services/Customers/Customers.services";

const CustomerCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "customerName", rules: { type: "text", label: "Customer Name", required: true, colWidth: 6 } },
    { name: "customerPhone", rules: { type: "text", label: "Phone Number", required: true, colWidth: 6 } },
    { name: "customerEmail", rules: { type: "email", label: "Email", required: true, colWidth: 6 } },
    { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 6 } },
    { name: "nationality", rules: { type: "text", label: "Nationality", required: true, colWidth: 6 } },
    { name: "companyId", rules: { type: "number", label: "Company ID", required: true, colWidth: 6 } },
    { name: "customerAddress", rules: { type: "textarea", label: "Address", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    // Prepare payload matching API expectation (note: nationalilty spelling matches API)
    const payload = {
      customerId: 0,
      customerName: formData.customerName?.trim(),
      customerPhone: formData.customerPhone?.trim(),
      customerEmail: formData.customerEmail?.trim(),
      dob: formData.dob,
      nationalilty: formData.nationality?.trim(), // API expects 'nationalilty'
      customerAddress: formData.customerAddress?.trim(),
      createdAt: new Date().toISOString(),
      isActive: Boolean(formData.isActive),
      companyId: Number(formData.companyId),
      isDeleted: false,
    };

    await CustomerService.createCustomer(payload);
  };

  return (
    <KiduCreate
      title="Create Customer"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Customer"
      showResetButton
      successMessage="Customer created successfully!"
      errorMessage="Failed to create customer.Please try again."
      navigateOnSuccess="/dashboard/customer-list"
      navigateDelay={1200}
      themeColor="#1B3763"
    />
  );
};

export default CustomerCreate;