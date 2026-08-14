import React, { useEffect, useState, useMemo } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field, SelectOption } from "../../Components/KiduCreate";
import ReportService from "../../Services/Reports/Reports.services";
import type { Reports } from "../../Types/Reports/Reports.types";

// TODO: swap these for whatever services your ReportTypePopup / YearMasterPopup /
// MonthPopup / CirclePopup / BranchPopup / MemberPopup already call internally —
// I don't have those files, so these are placeholder imports/method names.
import ReportTypeService from "../../Services/Settings/ReportType.services";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import MonthService from "../../Services/Settings/Month.services";
import CircleService from "../../Services/Settings/Circle.services";
import BranchService from "../../Services/Settings/Branch.services";
//import MemberService from "../../Services/Contributions/Member.services";

import type { ReportType } from "../../Types/Settings/ReportType.types";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import type { Month } from "../../Types/Settings/Month.types";
import type { Circle } from "../../Types/Settings/Circle.types";
import type { Branch } from "../../Types/Settings/Branch.types";
import type { Member } from "../../Types/Contributions/Member.types";
import type { MemberLookupItem } from "../../../Types/Lookup.types";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";


function mapMemberLookupItem(raw: MemberLookupItem): Member {
  return {
    memberId: raw.memberId,
    staffNo: raw.staffNo,
    name: raw.memberName,
    branchName: raw.branchName,
    designationId: 0,
    categoryId: 0,
    branchId: 0,
    genderId: 0,
    dob: "",
    doj: "",
    dojtoScheme: "",
    statusId: 0,
    isRegCompleted: false,
    createdByUserId: 0,
    createdDate: "",
    createdDateString: "",
    modifiedByUserId: 0,
    modifiedDate: "",
    modifiedDateString: "",
    nominee: "",
    nomineeRelation: "",
    nomineeIDentity: "",
    unionMember: "",
    totalRefund: "",
  } as Member;
}

const ReportsCreate: React.FC = () => {
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [years, setYears] = useState<YearMaster[]>([]);
  const [months, setMonths] = useState<Month[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

 useEffect(() => {
  ReportTypeService.getAllReportTypes().then((res) => setReportTypes(res ?? []));
  YearMasterService.getAllYearMasters().then((res) => setYears(res ?? []));
  MonthService.getAllMonths().then((res) => setMonths(res ?? []));
  CircleService.getAllCircles().then((res) => setCircles(res ?? []));
  BranchService.getAllBranches().then((res) => setBranches(res ?? []));
//  MemberService.getAllMembers().then((res) => setMembers(res ?? []));
HttpService.callApi<any>(
  `${API_ENDPOINTS.LOOKUP.PAGED}?entityName=member&pageNumber=1&pageSize=1000&searchTerm=&lookupMasterId=0`,
  "GET"
)
  .then((res) => {
    const rawItems: MemberLookupItem[] = Array.isArray(res?.value?.data) ? res.value.data : [];
    setMembers(rawItems.map(mapMemberLookupItem));
  })
  .catch((err) => {
    console.error("❌ Error fetching members for dropdown:", err);
    setMembers([]);
  });
}, []);

  const fields: Field[] = [
    { name: "reportTypeId", rules: { type: "select", label: "Report Type", required: true, colWidth: 4 } },
    { name: "yearOf", rules: { type: "select", label: "Year", required: true, colWidth: 4 } },
    { name: "monthCode", rules: { type: "select", label: "Month", required: true, colWidth: 4 } },
    { name: "circleId", rules: { type: "select", label: "Circle", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "select", label: "Branch", required: true, colWidth: 4 } },
    { name: "memberId", rules: { type: "select", label: "Member", required: true, colWidth: 4 } },
    { name: "isActive", rules: { type: "toggle", label: "Active" } },
  ];

  // options: only the *Name shows in the field, id is the stored value
  const options: Record<string, SelectOption[]> = useMemo(
    () => ({
      reportTypeId: reportTypes.map((rt) => ({ value: rt.reportTypeId, label: rt.reportTypeName })),
    //  yearOf: years.map((y) => ({ value: y.yearOf, label: String(y.yearOf) })),
    yearOf: years
  .filter((y) => y.yearOf !== undefined && y.yearOf !== null)
  .map((y) => ({ value: y.yearOf as number, label: String(y.yearOf) })),
      monthCode: months.map((m) => ({ value: m.monthCode, label: m.monthName })),
      circleId: circles.map((c) => ({ value: c.circleId, label: c.name })),
      branchId: branches.map((b) => ({ value: b.branchId, label: b.name })),
      memberId: members.map((m) => ({ value: m.memberId, label: m.name })),
    }),
    [reportTypes, years, months, circles, branches, members]
  );

  // When a select changes, stash the companion fields the payload needs
  // (Name, dpCode, staffNo, etc.) directly into formData — no separate
  // selectedX state needed anymore.
  const fieldChangeHandlers = {
    reportTypeId: (value: string, setFormData: any) => {
      const rt = reportTypes.find((r) => String(r.reportTypeId) === String(value));
      setFormData((prev: any) => ({ ...prev, reportTypeName: rt?.reportTypeName ?? "" }));
    },
    yearOf: (value: string, setFormData: any) => {
      setFormData((prev: any) => ({ ...prev, yearName: value }));
    },
    monthCode: (value: string, setFormData: any) => {
      const m = months.find((mm) => String(mm.monthCode) === String(value));
      setFormData((prev: any) => ({ ...prev, monthName: m?.monthName ?? "" }));
    },
    circleId: (value: string, setFormData: any) => {
      const c = circles.find((cc) => String(cc.circleId) === String(value));
      setFormData((prev: any) => ({ ...prev, circleName: c?.name ?? "" }));
    },
    branchId: (value: string, setFormData: any) => {
      const b = branches.find((bb) => String(bb.branchId) === String(value));
      setFormData((prev: any) => ({ ...prev, branchName: b?.name ?? "", dpCode: b?.dpCode ?? "" }));
    },
    memberId: (value: string, setFormData: any) => {
      const m = members.find((mm) => String(mm.memberId) === String(value));
      setFormData((prev: any) => ({ ...prev, memberName: m?.name ?? "", staffNo: m?.staffNo ?? "" }));
    },
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Omit<Reports, "auditLogs"> = {
      reportId: 0,
      reportTypeId: Number(formData.reportTypeId),
      reportTypeName: formData.reportTypeName,
      yearOf: Number(formData.yearOf),
      yearName: formData.yearName,
      monthCode: Number(formData.monthCode),
      monthName: formData.monthName,
      circleId: Number(formData.circleId),
      circleName: formData.circleName,
      branchId: Number(formData.branchId),
      dpCode: formData.dpCode,
      branchName: formData.branchName,
      memberId: Number(formData.memberId),
      memberName: formData.memberName,
      staffNo: formData.staffNo,
      createdDate: new Date().toISOString(),
      createdDateString: new Date().toLocaleDateString("en-IN"),
      modifiedDate: new Date().toISOString(),
      modifiedDateString: new Date().toLocaleDateString("en-IN"),
      isActive: Boolean(formData.isActive),
    };

    await ReportService.createReport(payload);
  };

  return (
    <KiduCreate
      title="Create Report"
      fields={fields}
      options={options}
      fieldChangeHandlers={fieldChangeHandlers}
      onSubmit={handleSubmit}
      submitButtonText="Create Report"
      showResetButton
      successMessage="Report created successfully!"
      errorMessage="Failed to create report. Please try again."
      navigateOnSuccess="/dashboard/report-list"
      navigateDelay={1200}
      themeColor="#1B3763"
    />
  );
};

export default ReportsCreate;