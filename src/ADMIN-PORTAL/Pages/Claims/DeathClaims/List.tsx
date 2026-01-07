// src/ADMIN-PORTAL/Pages/Claims/DeathClaims/DeathClaimList.tsx

import React from "react";
import type { DeathClaim } from "../../../Types/Claims/DeathClaims.type";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";

import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import MemberService from "../../../Services/Contributions/Member.services";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";

import KiduServerTable from "../../../../Components/KiduServerTable";

/* ===================== TABLE COLUMNS ===================== */
const columns = [
  { key: "deathClaimId", label: "Claim ID", enableSorting: true, type: "text" as const },

  { key: "memberName", label: "Member", enableSorting: true, type: "text" as const },
  { key: "stateName", label: "State", enableSorting: true, type: "text" as const },
  { key: "designationName", label: "Designation", enableSorting: true, type: "text" as const },

  { key: "deathDate", label: "Death Date", enableSorting: true, type: "date" as const },
  { key: "nominee", label: "Nominee Name", enableSorting: true, type: "text" as const },
  { key: "nomineeRelation", label: "Nominee Relation", enableSorting: true, type: "text" as const },
  { key: "amount", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "lastContribution", label: "Last Contribution", enableSorting: true, type: "text" as const },
  { key: "yearOF", label: "Year Of", enableSorting: true, type: "text" as const },
];

const DeathClaimList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {
    try {
      /* ===================== FETCH ALL DATA ===================== */
      const [
        claims,
        members,
        states,
        designations,
      ] = await Promise.all([
        DeathClaimService.getAllDeathClaims(),
        MemberService.getAllMembers(),
        StateService.getAllStates(),
        DesignationService.getAllDesignations(),
      ]);

      /* ===================== CREATE LOOKUP MAPS ===================== */
      const memberMap = Object.fromEntries(
        members.map((m: Member) => [m.memberId, m.name])
      );

      const stateMap = Object.fromEntries(
        states.map((s: State) => [s.stateId, s.name])
      );

      const designationMap = Object.fromEntries(
        designations.map((d: Designation) => [d.designationId, d.name])
      );

      /* ===================== ENRICH CLAIMS ===================== */
      let enrichedClaims = claims.map((c: DeathClaim) => ({
        ...c,
        memberName: memberMap[c.memberId] ?? "-",
        stateName: stateMap[c.stateId] ?? "-",
        designationName: designationMap[c.designationId] ?? "-",
      }));

      /* ===================== SEARCH ===================== */
      if (params.searchTerm && params.searchTerm.trim() !== "") {
        const q = params.searchTerm.toLowerCase();

        enrichedClaims = enrichedClaims.filter((c) =>
          [
            c.deathClaimId,
            c.memberName,
            c.stateName,
            c.designationName,
            c.nominee,
            c.nomineeRelation,
            c.amount,
            c.lastContribution,
            c.yearOF,
            c.deathDate,
          ]
            .map(String)
            .some((v) => v.toLowerCase().includes(q))
        );
      }

      /* ===================== PAGINATION ===================== */
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: enrichedClaims.slice(start, end),
        total: enrichedClaims.length,
      };
    } catch (error: any) {
      console.error("Error fetching death claims:", error);
      throw new Error(error.message || "Failed to fetch death claims");
    }
  };

  return (
    <KiduServerTable
      title="Death Claims"
      subtitle="Manage death claims with search, sort, and pagination"
      columns={columns}
      idKey="deathClaimId"
      addButtonLabel="Add Death Claim"
      addRoute="/dashboard/claims/deathclaims-create"
      editRoute="/dashboard/claims/deathclaims-edit"
      viewRoute="/dashboard/claims/deathclaims-view"
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

export default DeathClaimList;
