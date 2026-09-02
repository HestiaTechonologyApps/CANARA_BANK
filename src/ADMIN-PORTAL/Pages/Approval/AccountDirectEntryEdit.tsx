import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Member } from "../../Types/Contributions/Member.types";
import type { Branch } from "../../Types/Settings/Branch.types";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import type { Field } from "../../Components/KiduEdit";
import AccountDirectEntryService from "../../Services/Contributions/AccountDirectEntry.services";
import MemberService from "../../Services/Contributions/Member.services";
import BranchService from "../../Services/Settings/Branch.services";
import MonthService from "../../Services/Settings/Month.services";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import AuthService from "../../../Services/Auth.services";
import KiduEdit from "../../Components/KiduEdit";
import type { Month } from "../../Types/Settings/Month.types";


const THEME_COLOR = "#1B3763";

const AccountDirectEntryApprovalEdit: React.FC = () => {
  const navigate = useNavigate();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4, disabled: true } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 4, disabled: true } },
    { name: "yearOf", rules: { type: "popup", label: "Year", required: true, colWidth: 4, disabled: true } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA", required: true, colWidth: 4, disabled: true } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", required: true, colWidth: 4, disabled: true } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 4, disabled: true } },
    { name: "status", rules: { type: "text", label: "Status", disabled: true, colWidth: 4 } },
    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 4, disabled: true } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 4, disabled: true } },
    //{ name: "f9", rules: { type: "text", label: "F9", colWidth: 4, disabled: true } },
    //{ name: "f10", rules: { type: "text", label: "F10", colWidth: 4, disabled: true } },
    //{ name: "f11", rules: { type: "text", label: "F11", colWidth: 4, disabled: true } },
  ];

  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const entry = response.value;
    if (!entry) return response;

    if (entry.memberId) {
      const member = (await MemberService.getMemberById(entry.memberId)).value;
      setSelectedMember(member);
    }
    if (entry.branchId) {
      const branch = (await BranchService.getBranchById(entry.branchId)).value;
      setSelectedBranch(branch);
    }
    if (entry.monthCode) {
      const month = (await MonthService.getMonthById(entry.monthCode)).value;
      setSelectedMonth(month);
    }
    if (entry.yearOf) {
      const year = (await YearMasterService.getYearMasterById(entry.yearOf)).value;
      setSelectedYearMaster(year);
    }

    return {
      ...response,
      value: {
        ...entry,
        ddIbaDate: entry.ddIbaDate ? String(entry.ddIbaDate).split("T")[0] : "",
        approvedDate: entry.approvedDate ? String(entry.approvedDate).split("T")[0] : "",
      },
    };
  };

  const handleUpdate = async () => {
    throw new Error("This record is read-only. Use Approve or Reject.");
  };

  const getCurrentUserId = (): number => {
    const user = AuthService.getCurrentUser();
    if (!user?.userId) throw new Error("Unable to get current user. Please login again.");
    return user.userId;
  };

  const handleApprove = async (id: string) => {
    const currentUserId = getCurrentUserId();
    await AccountDirectEntryService.approveAccountDirectEntry(Number(id), { approve: true, currentUserId });
    navigate("/dashboard/approval-list?tab=accountDirectEntry");
  };

  const handleReject = async (id: string) => {
    const currentUserId = getCurrentUserId();
    await AccountDirectEntryService.approveAccountDirectEntry(Number(id), { approve: false, currentUserId });
    navigate("/dashboard/approval-list?tab=accountDirectEntry");
  };

  const popupHandlers = {
    memberId: { value: selectedMember?.name || "", actualValue: selectedMember?.memberId, onOpen: () => { } },
    branchId: { value: selectedBranch?.name || "", actualValue: selectedBranch?.branchId, onOpen: () => { } },
    monthCode: { value: selectedMonth?.monthName || "", actualValue: selectedMonth?.monthCode, onOpen: () => { } },
    yearOf: { value: selectedYearMaster ? String(selectedYearMaster.yearName) : "", actualValue: selectedYearMaster?.yearOf, onOpen: () => { } },
  };

  return (
    <KiduEdit
      title="Review Account Direct Entry"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      showResetButton={false}
      paramName="accountsDirectEntryID"
      navigateBackPath="/dashboard/approval-list?tab=accountDirectEntry"
      auditLogConfig={{ tableName: "ACCOUNT_DIRECT_ENTRY", recordIdField: "accountsDirectEntryID" }}
      popupHandlers={popupHandlers}
      themeColor={THEME_COLOR}
      approvalConfig={{
        onApprove: handleApprove,
        onReject: handleReject,
        confirmApproveText: "Are you sure you want to approve this entry?",
        confirmRejectText: "Are you sure you want to reject this entry?",
        showWhen: (formData) => !formData.isApproved,
      }}
    />
  );
};

export default AccountDirectEntryApprovalEdit;