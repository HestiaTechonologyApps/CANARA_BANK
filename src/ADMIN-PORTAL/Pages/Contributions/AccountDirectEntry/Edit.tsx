// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryEdit.tsx

import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";

import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Month } from "../../../Types/Settings/Month.types";

import MemberPopup from "../Member/MemberPopup";
import BranchPopup from "../../Branch/BranchPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";

const AccountDirectEntryEdit: React.FC = () => {
  // ───────────── Popup visibility ─────────────
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);

  // ───────────── Selected popup values ─────────────
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  // ───────────── Form fields ─────────────
  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },

    { name: "yearOf", rules: { type: "number", label: "Year", required: true, colWidth: 4 } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA", colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },

    { name: "status", rules: { type: "text", label: "Status", colWidth: 4 } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
  ];

  // ───────────── Fetch existing record ─────────────
  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const v = response.value;

    if (v) {
      setSelectedMember({
        memberId: v.memberId,
        name: v.name,
      } as Member);

      setSelectedBranch({
        branchId: v.branchId,
      } as Branch);

      setSelectedMonth({
        monthCode: v.monthCode,
        monthName: String(v.monthCode), // replace with real name if available
      } as Month);
    }

    return response;
  };

  // ───────────── Update handler ─────────────
  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedMember || !selectedBranch || !selectedMonth) {
      throw new Error("Please select all required values");
    }

    await AccountDirectEntryService.updateAccountDirectEntry(Number(id), {
      memberId: selectedMember.memberId,
      branchId: selectedBranch.branchId,
      monthCode: selectedMonth.monthCode ?? formData.monthCode,
      yearOf: Number(formData.yearOf),
      ddIba: formData.ddIba || "",
      ddIbaDate: formData.ddIbaDate || null,
      amt: Number(formData.amt),
      status: formData.status || "",
      isApproved: Boolean(formData.isApproved),
    });
  };

  // ───────────── Popup handlers (CRITICAL PART) ─────────────
  const popupHandlers = {
    memberId: {
      value: selectedMember?.name || "",
      actualValue: selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
    branchId: {
      value: selectedBranch?.branchId?.toString() || "",
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
      <KiduEdit
        title="Edit Account Direct Entry"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="accountsDirectEntryID"
        popupHandlers={popupHandlers}
        auditLogConfig={{
          tableName: "AccountDirectEntry",
          recordIdField: "accountsDirectEntryID",
        }}
        themeColor="#18575A"
      />

      {/* ───────────── Popups ───────────── */}
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

export default AccountDirectEntryEdit;
