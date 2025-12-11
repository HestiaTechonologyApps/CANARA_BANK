// src/components/User/UserEdit.tsx
import React from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { User } from "../../Types/Settings/User.types";
import UserService from "../../Services/Settings/User.services";
import defaultUserImage from "../../Assets/Images/profile.jpg"; // Add your default user image

const UserEdit: React.FC = () => {
  // Define form fields matching UserCreate
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
        colWidth: 6
      }
    },
    {
      name: "userEmail",
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
        colWidth: 4,
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
        disabled: true // Created date not editable
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

  // Fetch user data by ID
  const handleFetch = async (userId: string) => {
    try {
      // UserService.getUserById now returns CustomResponse<User>
      const response = await UserService.getUserById(Number(userId));
      return response;
    } catch (error: any) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  // Handle form update
  const handleUpdate = async (userId: string, formData: Record<string, any>) => {
    try {
      // Transform form data to match User type
      const userData: Omit<User, 'auditLogs'> = {
        userId: Number(userId),
        userName: formData.userName.trim(),
        userEmail: formData.userEmail.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address?.trim() || "",
        passwordHash: formData.passwordHash || "", // Keep existing if not changed
        isActive: Boolean(formData.isActive),
        islocked: Boolean(formData.islocked),
        createAt: formData.createAt || new Date().toISOString(),
        lastlogin: formData.lastlogin || null,
        companyId: Number(formData.companyId),
      };

      await UserService.updateUser(Number(userId), userData);
      
    } catch (error: any) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return (
    <KiduEdit
      title="Edit User"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update User"
      showResetButton={true}
      successMessage="User updated successfully!"
      errorMessage="Failed to update user. Please try again."
      paramName="userId"
      navigateBackPath="/dashboard/settings/user-list"
      loadingText="Loading User..."
      imageConfig={{
        fieldName: "profileImage",
        defaultImage: defaultUserImage,
        label: "Profile Picture",
        required: false,
        showNameField: "userName", // Show user name under image
        showIdField: "userId", // Show user ID
        showLastLoginField: "lastlogin", // Show last login
        editable: false // Set to false to disable upload functionality
      }}
      auditLogConfig={{
        tableName: "User",
        recordIdField: "userId"
      }}
      themeColor="#18575A"
    />
  );
};

export default UserEdit;