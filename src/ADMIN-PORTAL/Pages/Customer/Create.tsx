// src/components/Customer/CustomerCreate.tsx
import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { Customer } from "../../Types/Customers/Customers.types";
import CustomerService from "../../Services/Customers/Customers.services";


const CustomerCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Define form fields aligned with Customer interface
  const fields: Field[] = [
    {
      name: "customerName",
      rules: {
        type: "text",
        label: "Customer Name",
        required: true,
        minLength: 3,
        maxLength: 100,
        placeholder: "Enter customer name",
        colWidth: 4,
      },
    },
    {
      name: "customerEmail",
      rules: {
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "Enter email address",
        colWidth: 4,
      },
    },
    {
      name: "customerPhone",
      rules: {
        type: "number",
        label: "Phone Number",
        required: true,
        minLength: 10,
        maxLength: 10,
        placeholder: "Enter 10-digit phone number",
        colWidth: 4,
      },
    },
    {
      name: "dob",
      rules: {
        type: "date",
        label: "Date of Birth",
        required: false,
        placeholder: "Select date of birth",
        colWidth: 4,
      },
    },
    {
      // NOTE: keeping the exact key name from your type: "nationalilty"
      name: "nationalilty",
      rules: {
        type: "text",
        label: "Nationality",
        required: false,
        placeholder: "Enter nationality",
        colWidth: 4,
      },
    },
    {
      name: "companyId",
      rules: {
        type: "number",
        label: "Company ID",
        required: true,
        placeholder: "Enter company ID",
        colWidth: 4,
      },
    },
    {
      name: "customerAddress",
      rules: {
        type: "textarea",
        label: "Address",
        required: false,
        placeholder: "Enter customer address",
        colWidth: 12,
      },
    },
    // Toggles at the bottom
    {
      name: "isActive",
      rules: {
        type: "toggle",
        label: "Is Active",
        required: false,
      },
    },
    {
      name: "isDeleted",
      rules: {
        type: "toggle",
        label: "Is Deleted",
        required: false,
      },
    },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      // Map form values to Customer (excluding customerId, auditLogs)
      const payload: Omit<Customer, "customerId" | "auditLogs"> = {
        customerName: String(formData.customerName).trim(),
        customerPhone: String(formData.customerPhone).trim(),
        customerEmail: String(formData.customerEmail).trim(),
        customerAddress: String(formData.customerAddress || "").trim(),
        // dob & createdAt accept Date | string per your type
        dob: formData.dob ? new Date(formData.dob).toISOString() : "",
        nationalilty: String(formData.nationalilty || "").trim(),
        createdAt: new Date().toISOString(),
        isActive: Boolean(formData.isActive),
        companyId: Number(formData.companyId),
        isDeleted: Boolean(formData.isDeleted),
      };

      await CustomerService.createCustomer(payload);
      // KiduCreate will handle success UI + navigation via props below
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error; // let KiduCreate show error toast/message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create New Customer"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Customer"
      showResetButton={true}
      loadingState={isLoading}
      successMessage="Customer created successfully!"
      errorMessage="Failed to create customer. Please try again."
      navigateOnSuccess="/dashboard/customer-list"
      navigateDelay={1500}
      themeColor="#18575A"
    />
  );
};

export default CustomerCreate;
