// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryEdit.tsx

import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";

import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Month } from "../../../Types/Settings/Month.types";
import type { AccountDirectEntry } from "../../../../STAFF-PORTAL/Types/AccountDirectEntry.types";

import MemberPopup from "../Member/MemberPopup";
import BranchPopup from "../../Branch/BranchPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";

import MemberService from "../../../Services/Contributions/Member.services";
import BranchService from "../../../Services/Settings/Branch.services";
import MonthService from "../../../Services/Settings/Month.services";

const AccountDirectEntryEdit: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);

  const toIso = (v?: string) => (v ? `${v}T00:00:00` : null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },

    { name: "yearOf", rules: { type: "number", label: "Year", required: true, colWidth: 4 } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA", colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },

    { name: "status", rules: { type: "text", label: "Status", colWidth: 4,disabled:true,} },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
  ];

  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const entry = response.value;

    if (entry) {
      const member = await MemberService.getMemberById(entry.memberId);
      setSelectedMember(member.value);

      const branch = await BranchService.getBranchById(entry.branchId);
      setSelectedBranch(branch.value);

      const month = await MonthService.getMonthById(entry.monthCode);
      setSelectedMonth(month.value);
    }

    return response;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedMember || !selectedBranch || !selectedMonth) {
      throw new Error("Please select all required values");
    }

    if (!formData.ddIbaDate) {
      throw new Error("DD / IBA Date is required");
    }

   const payload: Omit<AccountDirectEntry, "auditLogs"> = {
  accountsDirectEntryID: Number(id),
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
  isApproved: formData.isApproved === true,

  ...(formData.isApproved && {
    approvedByUserId: 1,
    approvedDateString: toIso(formData.approvedDate),
  }),
};


    await AccountDirectEntryService.updateAccountDirectEntry(Number(id), payload);
    return true;
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
        themeColor="#1B3763"
      />

      <MemberPopup show={showMemberPopup} handleClose={() => setShowMemberPopup(false)} onSelect={setSelectedMember} />
      <BranchPopup show={showBranchPopup} handleClose={() => setShowBranchPopup(false)} onSelect={setSelectedBranch} />
      <MonthPopup show={showMonthPopup} handleClose={() => setShowMonthPopup(false)} onSelect={setSelectedMonth} />
    </>
  );
};

export default AccountDirectEntryEdit;
