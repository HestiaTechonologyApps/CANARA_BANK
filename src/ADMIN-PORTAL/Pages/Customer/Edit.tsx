// src/components/Customer/CustomerEdit.tsx
import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import defaultCustomerImage from "../../Assets/Images/profile.jpg"; // fallback avatar
import CustomerService from "../../Services/Customers/Customers.services";
import type { Customer } from "../../Types/Customers/Customers.types";

const CustomerEdit: React.FC = () => {
  // Define form fields similar to UserEdit but for customers
  const fields: Field[] = [
    {
      name: "customerName",
      rules: {
        type: "text",
        label: "Customer Name",
        required: true,
        minLength: 3,
        maxLength: 50,
        placeholder: "Enter customer name",
        colWidth: 6
      }
    },
    {
      name: "customerEmail",
      rules: {
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "Enter email address",
        colWidth: 6
      }
    },
    {
      name: "phoneNumber",
      rules: {
        type: "number",
        label: "Phone Number",
        required: true,
        minLength: 10,
        maxLength: 10,
        placeholder: "Enter 10-digit phone number",
        colWidth: 4
      }
    },
    {
      name: "companyId",
      rules: {
        type: "number",
        label: "Company ID",
        required: true,
        placeholder: "Enter company ID",
        colWidth: 4
      }
    },
    {
      name: "createAt",
      rules: {
        type: "date",
        label: "Created At",
        required: false,
        colWidth: 4,
        disabled: true // Creation date not editable
      }
    },
    {
      name: "address",
      rules: {
        type: "textarea",
        label: "Address",
        required: false,
        placeholder: "Enter address",
        colWidth: 12
      }
    },
    // Toggles
    {
      name: "isActive",
      rules: {
        type: "toggle",
        label: "Is Active",
        required: false
      }
    },
    {
      name: "islocked",
      rules: {
        type: "toggle",
        label: "Is Locked",
        required: false
      }
    }
  ];

  // Fetch customer data by ID
  const handleFetch = async (customerId: string) => {
    try {
      const response = await CustomerService.getCustomerById(Number(customerId));
      return response;
    } catch (error: any) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  };

  // Update customer
  const handleUpdate = async (customerId: string, formData: Record<string, any>) => {
    try {
      // Adapt to your Customer type; omit fields your API doesn't accept
      const customerData: Omit<Customer, "auditLogs"> = {
        customerId: Number(customerId),
        customerName: formData.customerName?.trim(),
        customerEmail: formData.customerEmail?.trim(),
        phoneNumber: formData.phoneNumber?.trim(),
        address: formData.address?.trim() || "",
        isActive: Boolean(formData.isActive),
        islocked: Boolean(formData.islocked),
        createAt: formData.createAt || new Date().toISOString(),
        lastlogin: formData.lastlogin || null, // if your model uses a different field, adjust here
        companyId: Number(formData.companyId)
      } as unknown as Omit<Customer, "auditLogs">;

      await CustomerService.updateCustomer(Number(customerId), customerData);
    } catch (error: any) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit Customer"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update Customer"
      showResetButton={true}
      successMessage="Customer updated successfully!"
      errorMessage="Failed to update customer. Please try again."
      paramName="customerId"
      navigateBackPath="/dashboard/customer-list"
      loadingText="Loading Customer..."
      imageConfig={{
        fieldName: "profileImage",
        defaultImage: defaultCustomerImage,
        label: "Profile Picture",
        required: false,
        showNameField: "customerName",
        showIdField: "customerId",
        showLastLoginField: "lastlogin", // change if your model uses another name
        editable: false
      }}
      auditLogConfig={{
        tableName: "Customer",
        recordIdField: "customerId"
      }}
      themeColor="#18575A"
    />
  );
};

export default CustomerEdit;
