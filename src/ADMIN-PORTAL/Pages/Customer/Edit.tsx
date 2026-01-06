// src/components/Customer/CustomerEdit.tsx
import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { Customer } from "../../Types/Customers/Customers.types";
import CustomerService from "../../Services/Customers/Customers.services";


const CustomerEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "customerId", rules: { type: "number", label: "Customer ID", disabled: true, colWidth: 3 } },
    { name: "customerName", rules: { type: "text", label: "Customer Name", required: true, colWidth: 6 } },
    { name: "customerPhone", rules: { type: "text", label: "Phone Number", required: true, colWidth: 6 } },
    { name: "customerEmail", rules: { type: "email", label: "Email", required: true, colWidth: 6 } },
    { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 6 } },
    { name: "nationality", rules: { type: "text", label: "Nationality", colWidth: 6 } },
    { name: "customerAddress", rules: { type: "textarea", label: "Address", required: true, colWidth: 12 } },
    { name: "companyId", rules: { type: "number", label: "Company ID", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

  const handleFetch = async (id: string) => {
    return CustomerService.getCustomerById(Number(id));
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
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

    await CustomerService.updateCustomer(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Customer"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Customer"
      showResetButton
      successMessage="Customer updated successfully!"
      errorMessage="Failed to update customer."
      paramName="customerId"
      navigateBackPath="/dashboard/customer-list"
      auditLogConfig={{
        tableName: "Customer",
        recordIdField: "customerId",
      }}
      themeColor="#1B3763"
    />
  );
};

export default CustomerEdit;
