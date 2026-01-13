// src/ADMIN-PORTAL/Pages/Contributions/RefundContribution/RefundContributionList.tsx
import React from "react";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import KiduServerTable from "../../../../Components/KiduServerTable";
import type { RefundContribution } from "../../../Types/Claims/Refund.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
//import type { Member } from "../../../Types/Contributions/Member.types";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";
import MemberService from "../../../Services/Contributions/Member.services";

/* ===================== TABLE COLUMNS ===================== */
const columns = [

  { key: "refundContributionId", label: "Refund ID", enableSorting: true, type: "text" as const },
  { key: "refundNO", label: "Refund No", enableSorting: true, type: "text" as const },
  { key: "staff", label: "Staff", enableSorting: true, type: "text" as const },
  { key: "stateName", label: "State", enableSorting: true, type: "text" as const },
  { key: "designationName", label: "Designation", enableSorting: true, type: "text" as const },
  { key: "branchNameOFTime", label: "Branch Name", enableSorting: true, type: "text" as const },
  { key: "dpcodeOfTime", label: "DP Code", enableSorting: true, type: "text" as const },
  { key: "type", label: "Type", enableSorting: true, type: "text" as const },
  { key: "amount", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "yearOF", label: "Year Of", enableSorting: true, type: "text" as const },
  
];

const RefundContributionList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      /* ===================== FETCH ALL DATA ===================== */
      const [
        refunds,
        states,
        designations,
        members,
      ] = await Promise.all([
        RefundContributionService.getAllRefundContributions(),
        StateService.getAllStates(),
        DesignationService.getAllDesignations(),
        MemberService.getAllMembers(),
      ]);

      /* ===================== CREATE LOOKUP MAPS ===================== */
      const stateMap = Object.fromEntries(
        states.map((s: State) => [s.stateId, s.name])
      );

      const designationMap = Object.fromEntries(
        designations.map((d: Designation) => [d.designationId, d.name])
      );

      // const staffMap = Object.fromEntries(
      //   members.map((m: Member) => [m.staffNo, m.name])
      // );
const memberMap = Object.fromEntries(
  members.map(m => [m.memberId, `${m.staffNo} - ${m.name}`])
);


      /* ===================== ENRICH REFUND DATA ===================== */
      let enrichedRefunds = refunds.map((r: RefundContribution) => ({
        ...r,
        stateName: stateMap[r.stateId] ?? "-",
        designationName: designationMap[r.designationId] ?? "-",
        staff: memberMap[r.memberId] ?? "-",
      }));

      /* ===================== SEARCH ===================== */
      if (params.searchTerm) {
        const q = params.searchTerm.toLowerCase();

        enrichedRefunds = enrichedRefunds.filter((r) =>
          [
            r.refundContributionId,
            r.refundNO,
            r.staff,
            r.stateName,
            r.designationName,
            r.branchNameOFTime,
            r.dpcodeOfTime,
            r.type,
            r.amount,
            r.yearOF,
          ]
            .map(String)
            .some((v) => v.toLowerCase().includes(q))
        );
      }

      /* ===================== PAGINATION ===================== */
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: enrichedRefunds.slice(start, end),
        total: enrichedRefunds.length,
      };
    } catch (error: any) {
      console.error("Error fetching refund contributions:", error);
      throw new Error(error.message || "Failed to fetch refund contributions");
    }
  };

  return (
    <KiduServerTable
      title="Refund Contribution Management"
      subtitle="Manage refund contributions with search and pagination"
      columns={columns}
      idKey="refundContributionId"
      addButtonLabel="Add Refund"
      addRoute="/dashboard/claims/refundcontribution-create"
      editRoute="/dashboard/claims/refundcontribution-edit"
      viewRoute="/dashboard/claims/refundcontribution-view"
      showAddButton
      showExport
      showSearch
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default RefundContributionList;
