import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
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
    { name: "ddIba", rules: { type: "text", label: "DD / IBA", required: true, colWidth: 4 } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", required: true, colWidth: 4 } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "status", rules: { type: "text", label: "Status", disabled: true, colWidth: 4 } },
    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 4 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 4 } },
    { name: "f9", rules: { type: "text", label: "F9", colWidth: 4 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 4 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 4 } },
    { name: "approvedBy", rules: { type: "text", label: "Approved By", colWidth: 4 } },
    { name: "approvedDate", rules: { type: "date", label: "Approved Date", colWidth: 4 } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
  ];

  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const entry = response.value;
    if (!entry) return response;
    if (entry.memberId) setSelectedMember((await MemberService.getMemberById(entry.memberId)).value);
    if (entry.branchId) setSelectedBranch((await BranchService.getBranchById(entry.branchId)).value);
    if (entry.monthCode) setSelectedMonth((await MonthService.getMonthById(entry.monthCode)).value);
    if (entry.yearOf) setSelectedYearMaster((await YearMasterService.getYearMasterById(entry.yearOf)).value);

    return {
      ...response,
      value: {
        ...entry,
        ddIbaDate: entry.ddIbaDateString?.split("T")[0],
        approvedDate: entry.approvedDateString?.split("T")[0],
      },
    };
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedMember || !selectedBranch || !selectedMonth || !selectedYearMaster) {
      throw new Error("Please select all required values");
    }

    await AccountDirectEntryService.updateAccountDirectEntry(Number(id), {
      accountsDirectEntryID: Number(id), 
      memberId: selectedMember.memberId,
      memberName: selectedMember.name,
      branchId: selectedBranch.branchId,
      branchName: selectedBranch.name,
      monthCode: selectedMonth.monthCode,
      monthName: selectedMonth.monthName,
      yearOf: selectedYearMaster.yearOf,
      yearName: Number(selectedYearMaster.yearName),
      ddIba: formData.ddIba,
      ddIbaDate: `${formData.ddIbaDate}T00:00:00`,
      ddIbaDateString: `${formData.ddIbaDate}T00:00:00`, 
      status: formData.status,
      amt: Number(formData.amt),
      approvedBy: formData.approvedBy || undefined,
      approvedDate: formData.approvedDate ? `${formData.approvedDate}T00:00:00` : undefined,
      approvedDateString: formData.approvedDate ? `${formData.approvedDate}T00:00:00` : undefined,
      isApproved: Boolean(formData.isApproved),
      enrl: formData.enrl || "",
      fine: formData.fine || "",
      f9: formData.f9 || "",
      f10: formData.f10 || "",
      f11: formData.f11 || "",
    });
  };

  const popupHandlers = {
    memberId: { 
      value: selectedMember?.name || "", 
      actualValue: selectedMember?.memberId, 
      onOpen: () => setShowMemberPopup(true) },
    branchId: { 
      value: selectedBranch?.name || "", 
      actualValue: selectedBranch?.branchId, 
      onOpen: () => setShowBranchPopup(true) },
    monthCode: { 
      value: selectedMonth?.monthName || "", 
      actualValue: selectedMonth?.monthCode, 
      onOpen: () => setShowMonthPopup(true) },
    yearOf: { 
      value: selectedYearMaster ? String(selectedYearMaster.yearName) : "", 
      actualValue: selectedYearMaster?.yearOf, 
      onOpen: () => setShowYearMasterPopup(true) },
  };

  return (
    <>
      <KiduEdit
        title="Edit Account Direct Entry"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="accountsDirectEntryID"
        navigateBackPath="/dashboard/contributions/accountDirectEntry-list"
        auditLogConfig={{ tableName: "ACCOUNT_DIRECT_ENTRY", recordIdField: "accountsDirectEntryID" }}
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
       show={showYearMasterPopup} 
       handleClose={() => setShowYearMasterPopup(false)} 
       onSelect={setSelectedYearMaster} 
       />
    </>
  );
};

export default AccountDirectEntryEdit;
