// src/components/User/UserCreate.tsx
import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { User } from "../../Types/Settings/User.types";
import UserService from "../../Services/Settings/User.services";

const UserCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Define form fields with column widths matching User interface
  const fields: Field[] = [
    {
      name: "userName",
      rules: {
        type: "text",
        label: "User Name",
        required: true,
        minLength: 3,
        maxLength: 50,
        placeholder: "Enter user name",
        colWidth: 4 // 3 columns per row
      }
    },
    {
      name: "userEmail",
      rules: {
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "Enter email address",
        colWidth: 4
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
      name: "passwordHash",
      rules: {
        type: "password",
        label: "Password",
        required: true,
        minLength: 8,
        placeholder: "Enter password",
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
      name: "address",
      rules: {
        type: "textarea",
        label: "Address",
        required: false,
        placeholder: "Enter address",
        colWidth: 4
      }
    },
    // Toggle fields at the bottom
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

  // Handle form submission
  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      // Transform form data to match User type
      const userData: Omit<User, 'userId' | 'auditLogs'> = {
        userName: formData.userName.trim(),
        userEmail: formData.userEmail.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address?.trim() || "",
        passwordHash: formData.passwordHash, // Will be hashed on server-side
        isActive: Boolean(formData.isActive),
        islocked: Boolean(formData.islocked),
        createAt: new Date().toISOString(),
        lastlogin: null,
        companyId: Number(formData.companyId),
      };

      await UserService.createUser(userData);
      
    } catch (error: any) {
      console.error("Error creating user:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create New User"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create User"
      showResetButton={true}
      loadingState={isLoading}
      successMessage="User created successfully!"
      errorMessage="Failed to create user. Please try again."
      navigateOnSuccess="/dashboard/settings/user-list"
      navigateDelay={1500}
      themeColor="#18575A"
    />
  );
};

export default UserCreate;