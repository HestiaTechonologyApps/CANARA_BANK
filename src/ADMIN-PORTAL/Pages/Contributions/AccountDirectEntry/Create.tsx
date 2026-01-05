// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryCreate.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import MemberPopup from "../Member/MemberPopup";
import BranchPopup from "../../Branch/BranchPopup";
import type { AccountsDirectEntry } from "../../../Types/Contributions/AccountDirectEntry.types";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";
import type { Month } from "../../../Types/Settings/Month.types";
import MonthPopup from "../../Settings/Month/MonthPopup";

const AccountDirectEntryCreate: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false)

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null)
  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month Code", required: true, colWidth: 4 } },
    { name: "yearOf", rules: { type: "number", label: "Year", required: true, colWidth: 4 } },

    { name: "ddIba", rules: { type: "text", label: "DD / IBA No", colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },

    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 3 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 3 } },

    { name: "f9", rules: { type: "text", label: "F9", colWidth: 4 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 4 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 4 } },

    { name: "status", rules: { type: "text", label: "Status", colWidth: 3 } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
    { name: "approvedBy", rules: { type: "text", label: "Approved By", colWidth: 3 } },
    { name: "approvedDate", rules: { type: "date", label: "Approved Date", colWidth: 3 } },
  ];

  const toIso = (v?: string) => (v ? `${v}T00:00:00` : "");

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedMember) throw new Error("Select member");
    if (!selectedBranch) throw new Error("Select branch");
    if (!selectedMonth) throw new Error ("Select month");

    const payload: Omit<AccountsDirectEntry, "accountsDirectEntryID" | "auditLogs"> = {
      memberId: selectedMember.memberId,
      name: selectedMember.name,
      branchId: selectedBranch.branchId,
      monthCode: selectedMonth.monthCode,
      yearOf: Number(formData.yearOf),
      ddIba: formData.ddIba || "",
      ddIbaDate: toIso(formData.ddIbaDate),
      amt: Number(formData.amt),
      enrl: formData.enrl || "",
      fine: formData.fine || "",
      f9: formData.f9 || "",
      f10: formData.f10 || "",
      f11: formData.f11 || "",
      status: formData.status || "",
      isApproved: Boolean(formData.isApproved),
      approvedBy: formData.approvedBy || "",
      approvedDate: toIso(formData.approvedDate),
    };

    await AccountDirectEntryService.createAccountDirectEntry(payload);
  };

  const popupHandlers = {
    memberId: {
      value: selectedMember?.name || "",
      actualValue: selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
    branchId: {
      value: selectedBranch?.name || "",
      actualValue: selectedBranch?.branchId,
      onOpen: () => setShowBranchPopup(true),
    },
    monthCode: {
      value: selectedMonth?.monthName || "",
      actualValue: selectedMonth?.monthCode,
      onOpen: ()=> setShowMonthPopup(true),
    }
  };

  return (
    <>
      <KiduCreate
        title="Create Account Direcy Entry"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        submitButtonText="Create Account Direcy Entry"
        showResetButton
        navigateOnSuccess="/dashboard/contributions/accountDirectEntry-list"
        successMessage="Entry created successfully"
        errorMessage="Failed to create entry. Please try again."
        themeColor="#18575A"
        navigateDelay={1200}
      />

      <MemberPopup show={showMemberPopup} handleClose={() => setShowMemberPopup(false)} onSelect={setSelectedMember} />
      <BranchPopup show={showBranchPopup} handleClose={() => setShowBranchPopup(false)} onSelect={setSelectedBranch} />
      <MonthPopup show={showMonthPopup} handleClose={()=> setShowMonthPopup(false)} onSelect={setSelectedMonth} />
       </>
  );
};

export default AccountDirectEntryCreate;
