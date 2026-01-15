// src/components/User/UserEdit.tsx

import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import type { User } from "../../Types/Settings/User.types";
import UserService from "../../Services/Settings/User.services";
import CompanyPopup from "../Settings/Company/CompanyPopup";
import MemberPopup from "../Contributions/Member/MemberPopup";
import type { Company } from "../../Types/Settings/Company.types";
import type { Member } from "../../Types/Contributions/Member.types";
import CompanyService from "../../Services/Settings/Company.services";
import MemberService from "../../Services/Contributions/Member.services";

const UserEdit: React.FC = () => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fields: Field[] = [
    { name: "userName", rules: { type: "text", label: "User Name", required: true, colWidth: 4 } },
    { name: "userEmail", rules: { type: "email", label: "Email Address", required: true, colWidth: 4 } },
   // { name: "staffNo", rules: { type: "popup", label: "Staff No", required: true, colWidth: 4 } },
    { name: "phoneNumber", rules: { type: "text", label: "Phone Number", required: true, colWidth: 4 } },
    { name: "role", rules: { type: "select", label: "Role", required: true, colWidth: 4 } },
    { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 4 } },
    { name: "address", rules: { type: "textarea", label: "Address", colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Is Active" } },
    { name: "islocked", rules: { type: "toggle", label: "Is Locked" } },
  ];

  const roleOptions = [
    { value: "Staff", label: "Staff" },
    { value: "Admin User", label: "Admin User" },
    { value: "Super Admin", label: "Super Admin" },
  ];

  const handleFetch = async (id: string) => {
  const response = await UserService.getUserById(Number(id));
  const user = response.value;

  // ✅ hydrate company popup
  if (user.companyId) {
    const companyRes = await CompanyService.getCompanyById(user.companyId);
    setSelectedCompany(companyRes.value);
  }

  // ✅ hydrate staff popup (NO getMemberByStaffNo needed)
  if (user.staffNo) {
    const members = await MemberService.getAllMembers();
    const member = members.find(m => m.staffNo === user.staffNo);
    if (member) {
      setSelectedMember(member);
    }
  }

  return response;
};


  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedCompany) throw new Error("Please select a company");
    if (!selectedMember) throw new Error("Please select a staff member");

    const payload: Partial<Omit<User, "auditLogs">> = {
      userId: Number(id),
      userName: formData.userName.trim(),
      userEmail: formData.userEmail.trim(),
      staffNo: selectedMember.staffNo,
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address?.trim() || "",
      role: formData.role,
      isActive: formData.isActive === true,
      islocked: formData.islocked === true,
      companyId: selectedCompany.companyId,
    };

    await UserService.updateUser(Number(id), payload);
    return true;
  };

  const popupHandlers = {
    companyId: {
      value: selectedCompany?.comapanyName ?? "",
      actualValue: selectedCompany?.companyId,
      onOpen: () => setShowCompanyPopup(true),
    },
    staffNo: {
      value: selectedMember ? `${selectedMember.staffNo} - ${selectedMember.name}` : "",
      actualValue: selectedMember?.staffNo,
      onOpen: () => setShowMemberPopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit User"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="userId"
        navigateBackPath="/dashboard/settings/user-list"
        auditLogConfig={{ tableName: "User", recordIdField: "userId" }}
        popupHandlers={popupHandlers}
        options={{ role: roleOptions }}
        themeColor="#1B3763"
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
          setSelectedMember(member);
          setShowMemberPopup(false);
        }}
      />
    </>
  );
};

export default UserEdit;
