import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import ReportService from "../../Services/Reports/Reports.services";
import type { Reports } from "../../Types/Reports/Reports.types";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import type { Month } from "../../Types/Settings/Month.types";
import type { Circle } from "../../Types/Settings/Circle.types";
import type { Branch } from "../../Types/Settings/Branch.types";
import type { Member } from "../../Types/Contributions/Member.types";
import CirclePopup from "../Circle/CirclePopup";
import MonthPopup from "../Settings/Month/MonthPopup";
import BranchPopup from "../Branch/BranchPopup";
import YearMasterPopup from "../YearMaster/YearMasterPopup";
import MemberPopup from "../Contributions/Member/MemberPopup";

const ReportsEdit: React.FC = () => {
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showCirclePopup, setShowCirclePopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);

  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fields: Field[] = [
    { name: "reportType", rules: { type: "text", label: "Report Type", required: true, colWidth: 6 } },
    { name: "yearOf", rules: { type: "popup", label: "Year", required: true, colWidth: 6 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 6 } },
    { name: "circleId", rules: { type: "popup", label: "Circle", required: true, colWidth: 6 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 6 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

  const handleFetch = async (id: string) => {
    const res = await ReportService.getReportById(Number(id));
    const data = res.value;

    if (!data) return res;

    setSelectedYearMaster({ yearOf: data.yearOf } as YearMaster);
    setSelectedMonth({ monthCode: data.monthCode, monthName: data.monthName } as Month);
    setSelectedCircle({ circleId: data.circleId, name: data.circleName } as Circle);
    setSelectedBranch({
      branchId: data.branchId,
      dpCode: data.dpCode,
      name: data.branchName,
    } as Branch);
    setSelectedMember({
      memberId: data.memberId,
      staffNo: data.staffNo,
      name: data.memberName,
    } as Member);

    return res;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedYearMaster || !selectedMonth || !selectedCircle || !selectedBranch || !selectedMember) {
      throw new Error("Please select all required fields");
    }

    const payload: Partial<Reports> = {
      reportId: Number(id),
      reportType: formData.reportType?.trim(),
      yearOf: selectedYearMaster.yearOf,
      yearName: String(selectedYearMaster.yearOf),
      monthCode: selectedMonth.monthCode,
      monthName: selectedMonth.monthName,
      circleId: selectedCircle.circleId,
      circleName: selectedCircle.name,
      branchId: selectedBranch.branchId,
      dpCode: selectedBranch.dpCode,
      branchName: selectedBranch.name,
      memberId: selectedMember.memberId,
      memberName: selectedMember.name,
      staffNo: selectedMember.staffNo,
      modifiedDate: new Date().toISOString(),
      modifiedDateString: new Date().toLocaleString(),
      isActive: Boolean(formData.isActive),
    };

    await ReportService.updateReport(Number(id), payload);
  };

  const popupHandlers = {
    yearOf: {
      value: selectedYearMaster ? String(selectedYearMaster.yearOf) : "",
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
    },
    monthCode: {
      value: selectedMonth ? String(selectedMonth.monthName) : "",
      actualValue: selectedMonth?.monthCode,
      onOpen: () => setShowMonthPopup(true),
    },
    circleId: {
      value: selectedCircle ? String(selectedCircle.name) : "",
      actualValue: selectedCircle?.circleId,
      onOpen: () => setShowCirclePopup(true),
    },
    branchId: {
      value: selectedBranch
        ? `${String(selectedBranch.dpCode)} - ${String(selectedBranch.name)}`
        : "",
      actualValue: selectedBranch?.branchId,
      onOpen: () => setShowBranchPopup(true),
    },
    memberId: {
      value: selectedMember
        ? `${String(selectedMember.staffNo)} - ${String(selectedMember.name)}`
        : "",
      actualValue: selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Report"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        submitButtonText="Update Report"
        showResetButton
        successMessage="Report updated successfully!"
        errorMessage="Failed to update report."
        loadingText="Loading report details..."
        paramName="reportId"
        navigateBackPath="/dashboard/report-list"
        auditLogConfig={{
          tableName: "Reports",
          recordIdField: "reportId",
        }}
        themeColor="#1B3763"
      />

      <YearMasterPopup
        show={showYearMasterPopup}
        handleClose={() => setShowYearMasterPopup(false)}
        onSelect={(y) => {
          setSelectedYearMaster(y);
          setShowYearMasterPopup(false);
        }}
      />

      <MonthPopup
        show={showMonthPopup}
        handleClose={() => setShowMonthPopup(false)}
        onSelect={(m) => {
          setSelectedMonth(m);
          setShowMonthPopup(false);
        }}
      />

      <CirclePopup
        show={showCirclePopup}
        handleClose={() => setShowCirclePopup(false)}
        onSelect={(c) => {
          setSelectedCircle(c);
          setShowCirclePopup(false);
        }}
      />

      <BranchPopup
        show={showBranchPopup}
        handleClose={() => setShowBranchPopup(false)}
        onSelect={(b) => {
          setSelectedBranch(b);
          setShowBranchPopup(false);
        }}
      />

      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={(m) => {
          setSelectedMember(m);
          setShowMemberPopup(false);
        }}
      />
    </>
  );
};

export default ReportsEdit;
