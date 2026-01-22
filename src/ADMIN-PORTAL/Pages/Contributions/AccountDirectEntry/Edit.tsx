import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import MemberPopup from "../Member/MemberPopup";
import BranchPopup from "../../Branch/BranchPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Month } from "../../../Types/Settings/Month.types";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import type { AccountDirectEntry } from "../../../Types/Contributions/AccountDirectEntry.types";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

const AccountDirectEntryEdit: React.FC = () => {

  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },
    { name: "yearOf", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA No", required: true, colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", required: true, colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 4 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 4 } },
    { name: "f9", rules: { type: "text", label: "F9", colWidth: 4 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 4 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 4 } },
    { name: "status", rules: { type: "text", label: "Status", required: true, colWidth: 4 , disabled: true} },
    { name: "isApproved", rules: { type: "toggle", label: "Approved", colWidth: 4 } },
    { name: "approvedBy", rules: { type: "text", label: "Approved By", colWidth: 4 } },
    { name: "approvedDate", rules: { type: "date", label: "Approved Date", colWidth: 4 } },
  ];

  const toIsoMidnight = (v?: string) => (v ? `${v}T00:00:00` : "");

  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const data = response.value;

    setSelectedMember({ memberId: data.memberId, name: data.memberName } as Member);
    setSelectedBranch({ branchId: data.branchId, name: data.branchName } as Branch);
    setSelectedMonth({ monthCode: data.monthCode, monthName: data.monthName } as Month);
    setSelectedYearMaster({ yearOf: data.yearOf, yearName: data.yearOf } as YearMaster);

    return data;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedMember) throw new Error("Please select Member");
    if (!selectedBranch) throw new Error("Please select Branch");
    if (!selectedMonth) throw new Error("Please select Month");
    if (!selectedYearMaster) throw new Error("Please select Year");

    const isApproved = Boolean(formData.isApproved);

    const payload: Partial<Omit<AccountDirectEntry, "accountsDirectEntryID" | "auditLogs">> = {
      memberId: selectedMember.memberId,
      name: selectedMember.name,
      branchId: selectedBranch.branchId,
      monthCode: selectedMonth.monthCode,
      yearOf: selectedYearMaster.yearOf,
      ddIba: formData.ddIba.trim(),
      ddIbaDate: toIsoMidnight(formData.ddIbaDate),
      amt: Number(formData.amt),
      enrl: formData.enrl || "",
      fine: formData.fine || "",
      f9: formData.f9 || "",
      f10: formData.f10 || "",
      f11: formData.f11 || "",
      status: formData.status,
      isApproved,
      approvedBy: isApproved ? formData.approvedBy?.trim() || "" : "",
      approvedDate: isApproved ? toIsoMidnight(formData.approvedDate) : "",
    };

    await AccountDirectEntryService.updateAccountDirectEntry(Number(id), payload);
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
        submitButtonText="Update Entry"
        showResetButton
        successMessage="Account Direct Entry updated successfully!"
        errorMessage="Failed to update Account Direct Entry"
        paramName="accountsDirectEntryID"
        navigateBackPath="/dashboard/contributions/accountDirectEntry-list"
        loadingText="Loading Account Direct Entry..."
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
        auditLogConfig={{
          tableName: "AccountDirectEntry",
          recordIdField: "accountsDirectEntryID",
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
      <YearMasterPopup
        show={showYearMasterPopup}
        handleClose={() => setShowYearMasterPopup(false)}
        onSelect={setSelectedYearMaster}
      />
    </>
  );
};

export default AccountDirectEntryEdit;
