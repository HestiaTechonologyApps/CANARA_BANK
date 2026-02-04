// src/components/User/UserCreate.tsx
import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { User } from "../../Types/Settings/User.types";
import UserService from "../../Services/Settings/User.services";
import type { Company } from "../../Types/Settings/Company.types";
import type { Member } from "../../Types/Contributions/Member.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";
import MemberPopup from "../Contributions/Member/MemberPopup";

const UserCreate: React.FC = () => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fields: Field[] = [
    { name: "userName", rules: { type: "text", label: "User Name", required: true, minLength: 3, maxLength: 50, colWidth: 4 } },
    { name: "userEmail", rules: { type: "email", label: "Email Address", required: true, colWidth: 4 } },
    { name: "staffNo", rules: { type: "popup", label: "Staff No", required: true, colWidth: 4 } },
    { name: "phoneNumber", rules: { type: "text", label: "Phone Number", required: true, minLength: 10, maxLength: 10, colWidth: 4 } },
    { name: "passwordHash", rules: { type: "password", label: "Password", required: true, minLength: 4, colWidth: 4 } },
    { name: "role", rules: { type: "select", label: "Role", required: true, colWidth: 4 } },
    { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 4 } },
    { name: "address", rules: { type: "textarea", label: "Address", colWidth: 4 } },
    { name: "isActive", rules: { type: "toggle", label: "Is Active" } },
    { name: "islocked", rules: { type: "toggle", label: "Is Locked" } },
  ];

  const roleOptions = [
    { value: "Staff", label: "Staff" },
    { value: "Admin User", label: "Admin User" },
    { value: "Super Admin", label: "Super Admin" }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedCompany) {
      throw new Error("Please select a company");
    }
    if (!selectedMember) {
      throw new Error("Please select a staff member");
    }

    const userData: Omit<User, "userId" | "auditLogs"> = {
      userName: formData.userName.trim(),
      userEmail: formData.userEmail.trim(),
      staffNo: selectedMember.staffNo,
      memberId: selectedMember.memberId, // ✅ ADD THIS - Automatically set from selected member
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address?.trim() || "",
      passwordHash: formData.passwordHash,
      isActive: Boolean(formData.isActive),
      islocked: Boolean(formData.islocked),
      createAt: new Date().toISOString(),
      lastlogin: null,
      role: formData.role.trim(),
      companyId: selectedCompany.companyId,
    };
    
    await UserService.createUser(userData);
  };

  const popupHandlers = {
    companyId: {
      value: selectedCompany?.comapanyName ?? "",
      onOpen: () => setShowCompanyPopup(true),
    },
    staffNo: {
      // ✅ UPDATED - Show both staffNo and memberId when selected
      value: selectedMember 
        ? `${selectedMember.staffNo} - ${selectedMember.name} (Member ID: ${selectedMember.memberId})` 
        : "",
      onOpen: () => setShowMemberPopup(true),
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
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
        options={{ role: roleOptions }}
      />

      <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={(company) => {
          setSelectedCompany(company);
          setShowCompanyPopup(false);
        }}
      />

      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={(member) => {
          // ✅ When member is selected, both staffNo and memberId are automatically available
          setSelectedMember(member);
          setShowMemberPopup(false);
          console.log('Selected Member:', {
            staffNo: member.staffNo,
            memberId: member.memberId,
            name: member.name
          });
        }}
      />
    </>
  );
};

export default UserCreate;