import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import type { AccountDirectEntry } from "../../../Types/Contributions/AccountDirectEntry.types";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Month } from "../../../Types/Settings/Month.types";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import BranchPopup from "../../Branch/BranchPopup";
import MonthPopup from "../../Settings/Month/MonthPopup";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import MemberService from "../../../Services/Contributions/Member.services";
import BranchService from "../../../Services/Settings/Branch.services";
import MonthService from "../../../Services/Settings/Month.services";
import YearMasterService from "../../../Services/Settings/YearMaster.services";
import AccountDirectEntryService from "../../../Services/Contributions/AccountDirectEntry.services";

const AccountDirectEntryEdit: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showYearPopup, setShowYearPopup] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearMaster | null>(null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4 } },
    { name: "yearOf", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA", required: true, colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", required: true, colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "status", rules: { type: "text", label: "Status", required: true, colWidth: 4 ,disabled:true} },
    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 4 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 4 } },
    { name: "f9", rules: { type: "text", label: "F9", colWidth: 4 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 4 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 4 } },
    { name: "approvedBy", rules: { type: "text", label: "Approved By", required: true, colWidth: 4 } },
    { name: "approvedDate", rules: { type: "date", label: "Approved Date", required: true, colWidth: 4 } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
  ];

  const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

  // ================= FETCH =================
  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const entry = response.value;
    if (!entry) return response;

    if (entry.memberId) {
      const member = await MemberService.getMemberById(entry.memberId);
      setSelectedMember(member.value);
    }

    if (entry.branchId) {
      const branch = await BranchService.getBranchById(entry.branchId);
      setSelectedBranch(branch.value);
    }

    if (entry.monthCode) {
      const month = await MonthService.getMonthById(entry.monthCode);
      setSelectedMonth(month.value);
    }

    if (entry.yearOf) {
      const year = await YearMasterService.getYearMasterById(entry.yearOf);
      setSelectedYear(year.value);
    }

    return {
      ...response,
      value: {
        ...entry,
        ddIbaDate: entry.ddIbaDateString?.split("T")[0] || entry.ddIbaDate,
        approvedDate: entry.approvedDateString?.split("T")[0] || entry.approvedDate,
      },
    };
  };

  // ================= UPDATE =================
  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedMember || !selectedBranch || !selectedMonth || !selectedYear) {
      throw new Error("Please select all required values");
    }

    const payload: Partial<Omit<AccountDirectEntry, "auditLogs">> = {
      accountsDirectEntryID: Number(id),

      memberId: selectedMember.memberId,
      name: selectedMember.name,
      branchId: selectedBranch.branchId,
      monthCode: selectedMonth.monthCode,
      yearOf: selectedYear.yearOf,
      yearName: Number(selectedYear.yearName), 
      ddIba: formData.ddIba,
      ddIbaDate: toIso(formData.ddIbaDate),
      ddIbaDateString: toIso(formData.ddIbaDate),
      amt: Number(formData.amt),
      status: formData.status,
      approvedBy: formData.approvedBy.trim(),
      approvedDate: toIso(formData.approvedDate),
      approvedDateString: toIso(formData.approvedDate),
      isApproved: Boolean(formData.isApproved),
      enrl: formData.enrl || "",
      fine: formData.fine || "",
      f9: formData.f9 || "",
      f10: formData.f10 || "",
      f11: formData.f11 || "",
    };

    await AccountDirectEntryService.updateAccountDirectEntry(Number(id), payload);
  };

  // ================= POPUPS =================
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
      value: selectedYear ? String(selectedYear.yearName) : "",
      actualValue: selectedYear?.yearOf,
      onOpen: () => setShowYearPopup(true),
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
        submitButtonText="Update Entry"
        showResetButton
        successMessage="Account entry updated successfully!"
        errorMessage="Failed to update entry. Please try again."
        navigateBackPath="/dashboard/contributions/accountDirectEntry-list"
        auditLogConfig={{ tableName: "AccountDirectEntry", recordIdField: "accountsDirectEntryID" }}
        popupHandlers={popupHandlers}
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
       show={showYearPopup} 
       handleClose={() => setShowYearPopup(false)} 
       onSelect={setSelectedYear} 
       />
    </>
  );
};

export default AccountDirectEntryEdit;
