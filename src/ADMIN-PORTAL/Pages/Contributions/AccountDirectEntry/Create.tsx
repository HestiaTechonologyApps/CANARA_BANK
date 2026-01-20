// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryCreate.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import type { AccountDirectEntry } from "../../../Types/Contributions/AccountDirectEntry.types";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Month } from "../../../Types/Settings/Month.types";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";
import MemberPopup from "../Member/MemberPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import BranchPopup from "../../Branch/BranchPopup";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";

const AccountDirectEntryCreate: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },
    { name: "yearOf", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },

    { name: "ddIba", rules: { type: "text", label: "DD / IBA No", colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", required: true, colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },

    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 3 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 3 } },
    { name: "f9", rules: { type: "text", label: "F9", colWidth: 3 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 3 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 3 } },

    { name: "status",rules: { type: "select", label: "Status", required: true, colWidth: 3,}, },
  ];

  /* ================= SUBMIT ================= */
  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedMember || !selectedBranch || !selectedMonth || !selectedYearMaster) {
      throw new Error("Please select Member, Branch, Month and Year");
    }

    const payload: Omit<AccountDirectEntry, "accountsDirectEntryID" | "auditLogs"> = {
      memberId: selectedMember.memberId,
      name: selectedMember.name,
      branchId: selectedBranch.branchId,
      monthCode: selectedMonth.monthCode,
      yearOf: selectedYearMaster.yearOf,

      ddIba: formData.ddIba || "",
      ddIbaDate: toIsoMidnight(formData.ddIbaDate),
      amt: Number(formData.amt),

      enrl: formData.enrl || "",
      fine: formData.fine || "",
      f9: formData.f9 || "",
      f10: formData.f10 || "",
      f11: formData.f11 || "",

      status: formData.status, 
      isApproved: false,
      approvedBy: "",
      approvedDate: "",
    };

    await AccountDirectEntryService.createAccountDirectEntry(payload);
  };

  /* ================= POPUPS ================= */
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
    yearOf: {
      value: selectedYearMaster?.yearName || "",
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
    },
  };

  const statusOptions = [
    { value: "Submitted", label: "Submitted" },
  ];

  return (
    <>
      <KiduCreate
        title="Create Account Direct Entry"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        options={{
          status: statusOptions,
        }}
        navigateOnSuccess="/dashboard/contributions/accountDirectEntry-list"
        successMessage="Entry submitted successfully!"
        errorMessage="Failed to submit entry"
        themeColor="#1B3763"
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
      <YearMasterPopup 
      show={showYearMasterPopup} 
      handleClose={() => setShowYearMasterPopup(false)} 
      onSelect={setSelectedYearMaster} 
      />
    </>
  );
};

export default AccountDirectEntryCreate;
