import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
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
import AuthService from "../../../../Services/Auth.services";

const THEME_COLOR = "#1B3763";

const AccountDirectEntryEdit: React.FC = () => {
  const { accountsDirectEntryID } = useParams();

  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const [initialMember, setInitialMember] = useState<Member | null>(null);
  const [initialBranch, setInitialBranch] = useState<Branch | null>(null);
  const [initialMonth, setInitialMonth] = useState<Month | null>(null);
  const [initialYearMaster, setInitialYearMaster] = useState<YearMaster | null>(null);

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [isApproved, setIsApproved] = useState<boolean>(false);

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
  ];

  const handleFetch = async (id: string) => {
    const response = await AccountDirectEntryService.getAccountDirectEntryById(Number(id));
    const entry = response.value;
    if (!entry) return response;

    setIsApproved(entry.isApproved);

    if (entry.memberId) {
      const member = (await MemberService.getMemberById(entry.memberId)).value;
      setSelectedMember(member);
      setInitialMember(member);
    }
    if (entry.branchId) {
      const branch = (await BranchService.getBranchById(entry.branchId)).value;
      setSelectedBranch(branch);
      setInitialBranch(branch);
    }
    if (entry.monthCode) {
      const month = (await MonthService.getMonthById(entry.monthCode)).value;
      setSelectedMonth(month);
      setInitialMonth(month);
    }
    if (entry.yearOf) {
      const year = (await YearMasterService.getYearMasterById(entry.yearOf)).value;
      setSelectedYearMaster(year);
      setInitialYearMaster(year);
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

  const handleReset = () => {
    setSelectedMember(initialMember);
    setSelectedBranch(initialBranch);
    setSelectedMonth(initialMonth);
    setSelectedYearMaster(initialYearMaster);
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedMember || !selectedBranch || !selectedMonth || !selectedYearMaster) {
      throw new Error("Please select all required values");
    }

    const payload = {
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
      enrl: formData.enrl || "",
      fine: formData.fine || "",
      f9: formData.f9 || "",
      f10: formData.f10 || "",
      f11: formData.f11 || "",
    };

    await AccountDirectEntryService.updateAccountDirectEntry(Number(id), payload);
  };

  const getCurrentUserId = (): number => {
    const user = AuthService.getCurrentUser();
    if (!user?.userId) throw new Error("Unable to get current user. Please login again.");
    return user.userId;
  };

  const handleApprove = async () => {
    if (!accountsDirectEntryID) return;

    const result = await Swal.fire({
      title: "Approve Entry?",
      text: "Are you sure you want to approve this entry?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: THEME_COLOR,
      confirmButtonText: "Yes, Approve",
    });

    if (!result.isConfirmed) return;

    setIsApproving(true);
    try {
      const currentUserId = getCurrentUserId();
      await AccountDirectEntryService.approveAccountDirectEntry(
        Number(accountsDirectEntryID),
        { approve: true, currentUserId }
      );
      setIsApproved(true);
      await Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Entry has been approved successfully.",
        confirmButtonColor: THEME_COLOR,
      });
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to approve entry.",
        confirmButtonColor: THEME_COLOR,
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!accountsDirectEntryID) return;

    const result = await Swal.fire({
      title: "Reject Entry?",
      text: "Are you sure you want to reject this entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Yes, Reject",
    });

    if (!result.isConfirmed) return;

    setIsRejecting(true);
    try {
      const currentUserId = getCurrentUserId();
      await AccountDirectEntryService.approveAccountDirectEntry(
        Number(accountsDirectEntryID),
        { approve: false, currentUserId }
      );
      setIsApproved(true);
      await Swal.fire({
        icon: "success",
        title: "Rejected!",
        text: "Entry has been rejected successfully.",
        confirmButtonColor: THEME_COLOR,
      });
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to reject entry.",
        confirmButtonColor: THEME_COLOR,
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const popupHandlers = {
    memberId: { value: selectedMember?.name || "", actualValue: selectedMember?.memberId, onOpen: () => setShowMemberPopup(true) },
    branchId: { value: selectedBranch?.name || "", actualValue: selectedBranch?.branchId, onOpen: () => setShowBranchPopup(true) },
    monthCode: { value: selectedMonth?.monthName || "", actualValue: selectedMonth?.monthCode, onOpen: () => setShowMonthPopup(true) },
    yearOf: { value: selectedYearMaster ? String(selectedYearMaster.yearName) : "", actualValue: selectedYearMaster?.yearOf, onOpen: () => setShowYearMasterPopup(true) },
  };

  return (
    <>
      {/* Approve / Reject buttons above KiduEdit */}
      <div className="d-flex justify-content-end gap-2 px-3 pt-3">
  <Button
    onClick={handleApprove}
    disabled={isApproving || isRejecting || isApproved} 
    style={{
      backgroundColor: isApproved ? "#6c757d" : THEME_COLOR, 
      border: "none",
      cursor: isApproved ? "not-allowed" : "pointer",
    }}
  >
    {isApproving ? "Approving..." : "Approve"}
  </Button>
  <Button
    onClick={handleReject}
    disabled={isApproving || isRejecting || isApproved} 
    variant={isApproved ? "secondary" : "danger"} 
    style={{ cursor: isApproved ? "not-allowed" : "pointer" }}
  >
    {isRejecting ? "Rejecting..." : "Reject"}
  </Button>
</div>

      <KiduEdit
        title="Edit Account Direct Entry"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="accountsDirectEntryID"
        navigateBackPath="/dashboard/contributions/accountDirectEntry-list"
        auditLogConfig={{ tableName: "ACCOUNT_DIRECT_ENTRY", recordIdField: "accountsDirectEntryID" }}
        popupHandlers={popupHandlers}
        themeColor={THEME_COLOR}
        showResetButton
        attachmentConfig={{ tableName: "AccountDirectEntry", recordIdField: "accountsDirectEntryID" }}
        onReset={handleReset}
      />

      <MemberPopup show={showMemberPopup} handleClose={() => setShowMemberPopup(false)} onSelect={setSelectedMember} />
      <BranchPopup show={showBranchPopup} handleClose={() => setShowBranchPopup(false)} onSelect={setSelectedBranch} />
      <MonthPopup show={showMonthPopup} handleClose={() => setShowMonthPopup(false)} onSelect={setSelectedMonth} />
      <YearMasterPopup show={showYearMasterPopup} handleClose={() => setShowYearMasterPopup(false)} onSelect={setSelectedYearMaster} />
    </>
  );
};

export default AccountDirectEntryEdit;