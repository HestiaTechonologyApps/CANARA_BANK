import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import ReportService from "../../Services/Reports/Reports.services";
import type { Reports } from "../../Types/Reports/Reports.types";

import ReportTypePopup from "../Settings/ReportType/ReportTypePopup";
import YearMasterPopup from "../YearMaster/YearMasterPopup";
import MonthPopup from "../Settings/Month/MonthPopup";
import CirclePopup from "../Circle/CirclePopup";
import BranchPopup from "../Branch/BranchPopup";
import MemberPopup from "../Contributions/Member/MemberPopup";

/* ---------------- Selection Models ---------------- */

type ReportTypeSelection = {
  reportTypeId: number;
  reportTypeName: string;
};

type YearSelection = {
  yearOf: number;
  yearName: string;
};

type MonthSelection = {
  monthCode: number;
  monthName: string;
};

type CircleSelection = {
  circleId: number;
  name: string;
};

type BranchSelection = {
  branchId: number;
  dpCode: number;
  name: string;
};

type MemberSelection = {
  memberId: number;
  name: string;
  staffNo: number;
};

const ReportsEdit: React.FC = () => {
  /* ---------------- Popup State ---------------- */

  const [showReportTypePopup, setShowReportTypePopup] = useState(false);
  const [showYearPopup, setShowYearPopup] = useState(false);
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showCirclePopup, setShowCirclePopup] = useState(false);
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);

  /* ---------------- Selected Values ---------------- */

  const [selectedReportType, setSelectedReportType] = useState<ReportTypeSelection | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearSelection | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<MonthSelection | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<CircleSelection | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchSelection | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberSelection | null>(null);

  /* ---------------- Fields ---------------- */

  const fields: Field[] = [
    { name: "reportType", rules: { type: "popup", label: "Report Type", required: true, colWidth: 6 } },
    { name: "yearOf", rules: { type: "popup", label: "Year", required: true, colWidth: 6 } },
    { name: "monthCode", rules: { type: "popup", label: "Month", required: true, colWidth: 6 } },
    { name: "circleId", rules: { type: "popup", label: "Circle", required: true, colWidth: 6 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 6 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

  /* ---------------- Fetch ---------------- */

  const handleFetch = async (id: string) => {
    const res = await ReportService.getReportById(Number(id));
    const data = res.value;
    if (!data) return res;

    setSelectedReportType({
      reportTypeId: data.reportTypeId,
      reportTypeName: data.reportTypeName,
    });

    setSelectedYear({
      yearOf: data.yearOf!,
      yearName: data.yearName,
    });

    setSelectedMonth({
      monthCode: data.monthCode,
      monthName: data.monthName,
    });

    setSelectedCircle({
      circleId: data.circleId,
      name: data.circleName,
    });

    setSelectedBranch({
      branchId: data.branchId,
      dpCode: data.dpCode,
      name: data.branchName,
    });

    setSelectedMember({
      memberId: data.memberId,
      name: data.memberName,
      staffNo: data.staffNo,
    });

    return res;
  };

  /* ---------------- Update ---------------- */

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedReportType || !selectedYear || !selectedMonth || !selectedCircle || !selectedBranch || !selectedMember) {
      throw new Error("Please select all required fields");
    }

    const payload: Omit<Reports, "auditLogs"> = {
      reportId: Number(id),

      reportTypeId: selectedReportType.reportTypeId,
      reportTypeName: selectedReportType.reportTypeName,

      yearOf: selectedYear.yearOf,
      yearName: selectedYear.yearName,

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

      createdDate: formData.createdDate,
      createdDateString: formData.createdDateString,
      modifiedDate: new Date().toISOString(),
      modifiedDateString: new Date().toLocaleDateString("en-IN"),

      isActive: Boolean(formData.isActive),
    };

    await ReportService.updateReport(Number(id), payload);
  };

  /* ---------------- Popup Handlers ---------------- */

  const popupHandlers = {
    reportType: {
      value: selectedReportType?.reportTypeName ?? "",
      actualValue: selectedReportType?.reportTypeId,
      onOpen: () => setShowReportTypePopup(true),
    },
    yearOf: {
      value: selectedYear?.yearName ?? "",
      actualValue: selectedYear?.yearOf,
      onOpen: () => setShowYearPopup(true),
    },
    monthCode: {
      value: selectedMonth?.monthName ?? "",
      actualValue: selectedMonth?.monthCode,
      onOpen: () => setShowMonthPopup(true),
    },
    circleId: {
      value: selectedCircle?.name ?? "",
      actualValue: selectedCircle?.circleId,
      onOpen: () => setShowCirclePopup(true),
    },
    branchId: {
      value: selectedBranch ? `${selectedBranch.dpCode} - ${selectedBranch.name}` : "",
      actualValue: selectedBranch?.branchId,
      onOpen: () => setShowBranchPopup(true),
    },
    memberId: {
      value: selectedMember ? `${selectedMember.staffNo} - ${selectedMember.name}` : "",
      actualValue: selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
  };

  /* ---------------- Render ---------------- */

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

      {/* ---------- Popups ---------- */}

      <ReportTypePopup
        show={showReportTypePopup}
        handleClose={() => setShowReportTypePopup(false)}
        onSelect={(v) => {
          setSelectedReportType({
            reportTypeId: v.reportTypeId,
            reportTypeName: v.reportTypeName,
          });
          setShowReportTypePopup(false);
        }}
      />

      <YearMasterPopup
        show={showYearPopup}
        handleClose={() => setShowYearPopup(false)}
        onSelect={(v) => {
          setSelectedYear({
            yearOf: v.yearOf,
            yearName: String(v.yearOf),
          });
          setShowYearPopup(false);
        }}
      />

      <MonthPopup
        show={showMonthPopup}
        handleClose={() => setShowMonthPopup(false)}
        onSelect={(v) => {
          setSelectedMonth({
            monthCode: v.monthCode,
            monthName: v.monthName,
          });
          setShowMonthPopup(false);
        }}
      />

      <CirclePopup
        show={showCirclePopup}
        handleClose={() => setShowCirclePopup(false)}
        onSelect={(v) => {
          setSelectedCircle({
            circleId: v.circleId,
            name: v.name,
          });
          setShowCirclePopup(false);
        }}
      />

      <BranchPopup
        show={showBranchPopup}
        handleClose={() => setShowBranchPopup(false)}
        onSelect={(v) => {
          setSelectedBranch({
            branchId: v.branchId,
            dpCode: v.dpCode,
            name: v.name,
          });
          setShowBranchPopup(false);
        }}
      />

      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={(v) => {
          setSelectedMember({
            memberId: v.memberId,
            name: v.name,
            staffNo: v.staffNo,
          });
          setShowMemberPopup(false);
        }}
      />
    </>
  );
};

export default ReportsEdit;
