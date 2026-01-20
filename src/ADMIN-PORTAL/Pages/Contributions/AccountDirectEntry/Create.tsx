// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryCreate.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Month } from "../../../Types/Settings/Month.types";
import type { AccountDirectEntry } from "../../../Types/Contributions/AccountDirectEntry.types";
import MemberPopup from "../Member/MemberPopup";
import BranchPopup from "../../Branch/BranchPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

const AccountDirectEntryCreate: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

  const fields: Field[] = [
     { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },
    { name: "yearOf", rules: { type: "number", label: "Year", required: true, colWidth: 4 } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA No", colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date",required:true, colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 3 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 3 } },
    { name: "f9", rules: { type: "text", label: "F9", colWidth: 4 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 4 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 4 } },
    { name: "status", rules: { type: "select", label: "Status", colWidth: 3 } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
    { name: "approvedBy", rules: { type: "text", label: "Approved By", colWidth: 3 } },
    { name: "approvedDate", rules: { type: "date", label: "Approved Date",required: true, colWidth: 3 } },
  ];

 const handleSubmit = async (formData: Record<string, any>) => {
  if (!selectedMember || !selectedBranch || !selectedMonth) {
    throw new Error("Please select all required values");
  }

  const isApproved = Boolean(formData.isApproved);

  const payload: any = {
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
  };

  if (isApproved) {
    if (!formData.approvedDate) {
      throw new Error("Approved Date is required when approving");
    }

    payload.approvedBy = formData.approvedBy?.trim() || "Admin";
    payload.approvedDate = toIso(formData.approvedDate);
  }

  await AccountDirectEntryService.createAccountDirectEntry(
    payload as Omit<AccountDirectEntry, "accountsDirectEntryID" | "auditLogs">
  );
};

//Status
const statusOptions=[
  {value:"Submitted", label:"Submitted"}
]

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
      onOpen: () => setShowMonthPopup(true),
    },
  };

  return (
    <>
      <KiduCreate
        title="Create Account Direct Entry"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        navigateOnSuccess="/dashboard/contributions/accountDirectEntry-list"
        themeColor="#1B3763"
        options={{
          status:statusOptions
        }}
      />

      <MemberPopup 
       show={showMemberPopup} 
       handleClose={() => setShowMemberPopup(false)} 
       onSelect={setSelectedMember} 
       />
      <BranchPopup 
       show={showBranchPopup} 
       handleClose={() => setShowBranchPopup(false)} 
       onSelect={setSelectedBranch} 
       />
      <MonthPopup 
       show={showMonthPopup} 
       handleClose={() => setShowMonthPopup(false)} 
       onSelect={setSelectedMonth} 
       />
    </>
  );
};

export default AccountDirectEntryCreate;
