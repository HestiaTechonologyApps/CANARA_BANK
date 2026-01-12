// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryEdit.tsx

import React, { useState } from "react";
import type { Member } from "../../../ADMIN-PORTAL/Types/Contributions/Member.types";
import type { Branch } from "../../../ADMIN-PORTAL/Types/Settings/Branch.types";
import type { Month } from "../../../ADMIN-PORTAL/Types/Settings/Month.types";
import AccountDirectEntryService from "../../Services/AccountDirectEntry.services";
import MemberService from "../../../ADMIN-PORTAL/Services/Contributions/Member.services";
import BranchService from "../../../ADMIN-PORTAL/Services/Settings/Branch.services";
import MonthService from "../../../ADMIN-PORTAL/Services/Settings/Month.services";
import type { AccountDirectEntry } from "../../Types/AccountDirectEntry.types";
import KiduEdit, { type Field } from "../../../ADMIN-PORTAL/Components/KiduEdit";
import MemberPopup from "../../../ADMIN-PORTAL/Pages/Contributions/Member/MemberPopup";
import BranchPopup from "../../../ADMIN-PORTAL/Pages/Branch/BranchPopup";
import MonthPopup from "../../../ADMIN-PORTAL/Pages/Settings/Month/MonthPopup";


const StaffAccountDirectEntryEdit: React.FC = () => {
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
    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 3 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 3 } },

    { name: "f9", rules: { type: "text", label: "F9", colWidth: 4 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 4 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 4 } },

    { name: "status", rules: { type: "text", label: "Status", colWidth: 4, disabled: true, } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
    { name: "approvedBy", rules: { type: "text", label: "Approved By", colWidth: 3 } },
    { name: "approvedDate", rules: { type: "date", label: "Approved Date", colWidth: 3 } },
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
          tableName: "AccountsDirectEntries",
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

export default StaffAccountDirectEntryEdit;
