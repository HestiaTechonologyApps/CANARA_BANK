// src/components/User/UserCreate.tsx
import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { User } from "../../Types/Settings/User.types";
import UserService from "../../Services/Settings/User.services";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const UserCreate: React.FC = () => {

  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fields: Field[] = [
    { name: "userName", rules: { type: "text", label: "User Name", required: true, minLength: 3, maxLength: 50, colWidth: 4 } },
    { name: "userEmail", rules: { type: "email", label: "Email Address", required: true, colWidth: 4 } },
    { name: "phoneNumber", rules: { type: "text", label: "Phone Number", required: true, minLength: 10, maxLength: 10, colWidth: 4 } },
    { name: "passwordHash", rules: { type: "password", label: "Password", required: true, minLength: 8, colWidth: 4 } },
    { name: "role", rules: { type: "text", label: "Role", required: true, colWidth: 4 } },
    { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 4 } },
    { name: "address", rules: { type: "textarea", label: "Address", colWidth: 4 } },
    { name: "isActive", rules: { type: "toggle", label: "Is Active" } },
    { name: "islocked", rules: { type: "toggle", label: "Is Locked" } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedCompany) {
      throw new Error("Please select a company");
    }

    const userData: Omit<User, "userId" | "auditLogs"> = {
      userName: formData.userName.trim(),
      userEmail: formData.userEmail.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address?.trim() || "",
      passwordHash: formData.passwordHash,
      isActive: Boolean(formData.isActive),
      islocked: Boolean(formData.islocked),
      createAt: new Date().toISOString(),  // Changed from 'createdAt'
      lastlogin: null,  // Changed from 'lastLogin'
      role: formData.role.trim(),  // Added role field
      companyId: selectedCompany.companyId,
    };
    
    await UserService.createUser(userData);
  };

  const popupHandlers = {
    companyId: {
      value: selectedCompany?.comapanyName ?? "",
      onOpen: () => setShowCompanyPopup(true),
    },
  };

  return (
    <>
      <KiduCreate
        title="Create New User"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create User"
        showResetButton
        successMessage="User created successfully!"
        errorMessage="Failed to create user. Please try again."
        navigateOnSuccess="/dashboard/settings/user-list"
        themeColor="#18575A"
        popupHandlers={popupHandlers}
      />

      <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={(company) => {
          setSelectedCompany(company);
          setShowCompanyPopup(false);
        }}
      />
    </>
  );
};

export default UserCreate;