// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryEdit.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import MemberPopup from "../Member/MemberPopup";
import BranchPopup from "../../Branch/BranchPopup";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";
import type { Month } from "../../../Types/Settings/Month.types";
import MonthPopup from "../../Settings/Month/MonthPopup";
import type { AccountsDirectEntry } from "../../../Types/Contributions/AccountDirectEntry.types";

const AccountDirectEntryEdit: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false)

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth,setSelectedMonth] = useState<Month | null>(null)

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "number", label: "Month Code", colWidth: 4 } },
    { name: "yearOf", rules: { type: "number", label: "Year", colWidth: 4 } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA" } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date" } },
    { name: "amt", rules: { type: "number", label: "Amount" } },
    { name: "status", rules: { type: "text", label: "Status" } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
  ];

  const handleFetch = async (id: string) => {
    const res = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const v = res.value;
    setSelectedMember({ memberId: v.memberId, name: v.name } as Member);
    setSelectedBranch({ branchId: v.branchId } as Branch);
    return res;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    await AccountDirectEntryService.updateAccountDirectEntry(Number(id), {
      memberId: selectedMember?.memberId,
      branchId: selectedBranch?.branchId,
      monthCode: selectedMonth?.monthCode,
      yearOf: formData.yearOf,
      ddIba: formData.ddIba,
      ddIbaDate: formData.ddIbaDate,
      amt: formData.amt,
      status: formData.status,
      isApproved: formData.isApproved,
    });
  };

  const popupHandlers = {
    memberId: { value: selectedMember?.name || "", onOpen: () => setShowMemberPopup(true) },
    branchId: { value: selectedBranch?.branchId?.toString() || "", onOpen: () => setShowBranchPopup(true) },
    monthCode: {value: selectedMonth?.monthName || "", onOpen: () => setShowMonthPopup(true) }
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
        auditLogConfig={{ tableName: "AccountDirectEntry", recordIdField: "accountsDirectEntryID" }}
        themeColor="#18575A"
      />

      <MemberPopup show={showMemberPopup} handleClose={() => setShowMemberPopup(false)} onSelect={setSelectedMember} />
      <BranchPopup show={showBranchPopup} handleClose={() => setShowBranchPopup(false)} onSelect={setSelectedBranch} />
      <MonthPopup show={showMonthPopup} handleClose={()=> setShowMonthPopup(false)} onSelect={setSelectedMonth} />
    </>
  );
};

export default AccountDirectEntryEdit;
