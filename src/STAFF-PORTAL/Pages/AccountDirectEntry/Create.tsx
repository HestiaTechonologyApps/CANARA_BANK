// src/ADMIN-PORTAL/Components/Accounts/AccountDirectEntryCreate.tsx
import React, { useEffect, useState } from "react";
import type { Member } from "../../../ADMIN-PORTAL/Types/Contributions/Member.types";
import type { Branch } from "../../../ADMIN-PORTAL/Types/Settings/Branch.types";
import type { Month } from "../../../ADMIN-PORTAL/Types/Settings/Month.types";
import type { Field } from "../../../ADMIN-PORTAL/Components/KiduCreate";
import KiduCreate from "../../../ADMIN-PORTAL/Components/KiduCreate";
import MemberPopup from "../../../ADMIN-PORTAL/Pages/Contributions/Member/MemberPopup";
import BranchPopup from "../../../ADMIN-PORTAL/Pages/Branch/BranchPopup";
import MonthPopup from "../../../ADMIN-PORTAL/Pages/Settings/Month/MonthPopup";
import AccountDirectEntryService from "../../../ADMIN-PORTAL/Services/Contributions/AccountDirectEntry.services";
import type { AccountDirectEntry } from "../../../ADMIN-PORTAL/Types/Contributions/AccountDirectEntry.types";
import type { YearMaster } from "../../../ADMIN-PORTAL/Types/Settings/YearMaster.types";
import YearMasterPopup from "../../../ADMIN-PORTAL/Pages/YearMaster/YearMasterPopup";

const StaffAccountDirectEntryCreate: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null)
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  // AUTO-POPULATE MEMBER FROM LOCAL STORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setSelectedMember({
        memberId: user.memberId,
        name: user.userName,
      } as Member);
    }
  }, []);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "popup", label: "Month Code", required: true, colWidth: 4 } },
    { name: "yearOf", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },
    { name: "ddIba", rules: { type: "text", label: "DD / IBA No", colWidth: 4, required: true } },
    { name: "ddIbaDate", rules: { type: "date", label: "DD / IBA Date", colWidth: 4, required: true } },
    { name: "amt", rules: { type: "number", label: "Amount", required: true, colWidth: 3 } },
    { name: "enrl", rules: { type: "text", label: "ENRL", colWidth: 3 } },
    { name: "fine", rules: { type: "text", label: "Fine", colWidth: 3 } },
    { name: "status", rules: { type: "select", label: "Status", colWidth: 3, required: true, } },
    { name: "f9", rules: { type: "text", label: "F9", colWidth: 2 } },
    { name: "f10", rules: { type: "text", label: "F10", colWidth: 2 } },
    { name: "f11", rules: { type: "text", label: "F11", colWidth: 2 } },
    { name: "isApproved", rules: { type: "toggle", label: "Approved" } },
    { name: "approvedBy", rules: { type: "text", label: "Approved By", colWidth: 3 } },
    { name: "approvedDate", rules: { type: "date", label: "Approved Date", colWidth: 3 } },
  ];

  const toIso = (v?: string) => (v ? `${v}T00:00:00` : "");

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedMember) throw new Error("Select member");
    if (!selectedBranch) throw new Error("Select branch");
    if (!selectedMonth) throw new Error("Select month");
    if (!selectedYearMaster) throw new Error("Please select Year");
    const payload: Omit<AccountDirectEntry, "accountsDirectEntryID" | "auditLogs"> = {
      memberId: selectedMember.memberId,
      branchId: selectedBranch.branchId,
      monthCode: selectedMonth.monthCode,
      // yearOf: Number(formData.yearOf),
      yearOf: selectedYearMaster.yearOf,
      ddIba: formData.ddIba || "",
      ddIbaDate: toIso(formData.ddIbaDate),
      amt: Number(formData.amt),
      enrl: formData.enrl || "",
      fine: formData.fine || "",
      f9: formData.f9 || "",
      f10: formData.f10 || "",
      f11: formData.f11 || "",
      status: formData.status || "Submitted",
      isApproved: Boolean(formData.isApproved),
      approvedBy: formData.approvedBy || "",
      approvedDate: toIso(formData.approvedDate),
    };

    await AccountDirectEntryService.createAccountDirectEntry(payload);
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
    yearOf: { value: selectedYearMaster?.yearName?.toString() || "", onOpen: () => setShowYearMasterPopup(true) },
  };

  //status option
  const statusOptions = [
    { value: "Submitted", label: "Submitted" }
  ]

  return (
    <>
      <KiduCreate
        title="Create Account Direcy Entry"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        submitButtonText="Create Account Direcy Entry"
        showResetButton
        navigateOnSuccess="/staff-portal/contribution-list"
        successMessage="Entry created successfully"
        errorMessage="Failed to create entry. Please try again."
        themeColor="#1B3763"
        navigateDelay={1200}
        options={{
          status: statusOptions
        }}
      />

      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={setSelectedMember}
        showAddButton={false}
      />

      <BranchPopup
        show={showBranchPopup}
        handleClose={() => setShowBranchPopup(false)}
        onSelect={setSelectedBranch}
        showAddButton={false}
      />

      <MonthPopup
        show={showMonthPopup}
        handleClose={() => setShowMonthPopup(false)}
        onSelect={setSelectedMonth}
        showAddButton={false}
      />

      <YearMasterPopup
        show={showYearMasterPopup}
        handleClose={() => setShowYearMasterPopup(false)}
        onSelect={setSelectedYearMaster}
        showAddButton={false}
      />
    </>
  );
};

export default StaffAccountDirectEntryCreate;
