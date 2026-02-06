// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryEdit.tsx

import React, { useState } from "react";
import type { Member } from "../../../ADMIN-PORTAL/Types/Contributions/Member.types";
import type { Branch } from "../../../ADMIN-PORTAL/Types/Settings/Branch.types";
import type { Month } from "../../../ADMIN-PORTAL/Types/Settings/Month.types";
import AccountDirectEntryService from "../../Services/AccountDirectEntry.services";
import KiduEdit, { type Field } from "../../../ADMIN-PORTAL/Components/KiduEdit";
import MemberPopup from "../../../ADMIN-PORTAL/Pages/Contributions/Member/MemberPopup";
import BranchPopup from "../../../ADMIN-PORTAL/Pages/Branch/BranchPopup";
import MonthPopup from "../../../ADMIN-PORTAL/Pages/Settings/Month/MonthPopup";
import type { AccountDirectEntry } from "../../../ADMIN-PORTAL/Types/Contributions/AccountDirectEntry.types";
import type { YearMaster } from "../../../ADMIN-PORTAL/Types/Settings/YearMaster.types";
import YearMasterPopup from "../../../ADMIN-PORTAL/Pages/YearMaster/YearMasterPopup";


const StaffAccountDirectEntryEdit: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const toIso = (v?: string) => (v ? `${v}T00:00:00` : null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },
    { name: "yearOf", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA", required: true, colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", required: true, colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 3 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 3 } },
    { name: "f9", rules: { type: "text", label: "F9", colWidth: 4 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 4 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 4 } },
    { name: "status", rules: { type: "text", label: "Status", colWidth: 4, required: true, disabled: true, } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
    { name: "approvedBy", rules: { type: "text", label: "Approved By", colWidth: 3 } },
    { name: "approvedDate", rules: { type: "date", label: "Approved Date", colWidth: 3 } },
  ];

  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const entry = response.value;

    if (entry) {
      setSelectedMember({
        memberId: entry.memberId,
        name: entry.memberName || entry.name,
      } as Member);

      setSelectedBranch({
        branchId: entry.branchId,
        name: entry.branchName,
      } as Branch);

      setSelectedMonth({
        monthCode: entry.monthCode,
        monthName: entry.monthName,
      } as Month);

      setSelectedYearMaster({ yearOf: entry.yearOf, yearName: entry.yearName } as YearMaster);

    }

    return response;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedMember || !selectedBranch || !selectedMonth || !selectedYearMaster) {
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
      // yearOf: Number(formData.yearOf),
      yearOf: selectedYearMaster?.yearOf || "",
      ddIba: formData.ddIba || "",
      ddIbaDate: toIso(formData.ddIbaDate),
      amt: Number(formData.amt),
      enrl: formData.enrl || "",
      fine: formData.fine || "",
      f9: formData.f9 || "",
      f10: formData.f10 || "",
      f11: formData.f11 || "",
      status: formData.status || "",
      approvedBy: formData.approvedBy || "",
      approvedDate: formData.approvedDate || "",
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
      onOpen: () => setShowMemberPopup(false),
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
      value: selectedYearMaster?.yearName?.toString() || "",
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
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
          tableName: "ACCOUNT_DIRECT_ENTRY",
          recordIdField: "accountsDirectEntryID",
        }}
        themeColor="#1B3763"
      />

      <MemberPopup show={showMemberPopup} handleClose={() => setShowMemberPopup(false)} onSelect={setSelectedMember} showAddButton={false} />
      <BranchPopup show={showBranchPopup} handleClose={() => setShowBranchPopup(false)} onSelect={setSelectedBranch} showAddButton={false} />
      <MonthPopup show={showMonthPopup} handleClose={() => setShowMonthPopup(false)} onSelect={setSelectedMonth} showAddButton={false} />
      <YearMasterPopup
        show={showYearMasterPopup}
        handleClose={() => setShowYearMasterPopup(false)}
        onSelect={setSelectedYearMaster}
        showAddButton={false}
      />
    </>
  );
};

export default StaffAccountDirectEntryEdit;
