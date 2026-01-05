// src/ADMIN-PORTAL/Pages/Claims/DeathClaims/DeathClaimList.tsx
import React from "react";
import type { DeathClaim } from "../../../Types/Claims/DeathClaims.type";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import KiduServerTable from "../../../../Components/KiduServerTable";

const columns = [
  { key: "deathClaimId", label: "Claim ID", enableSorting: true, type: "text" as const },
  { key: "memberId", label: "Member ID", enableSorting: true, type: "text" as const },
  { key: "stateId", label: "State ID", enableSorting: true, type: "text" as const },
  { key: "designationId", label: "Designation ID", enableSorting: true, type: "text" as const },
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
  }): Promise<{ data: DeathClaim[]; total: number }> => {
    try {
      const claims = await DeathClaimService.getAllDeathClaims();
      let filtered = claims;

      if (params.searchTerm && params.searchTerm.trim() !== "") {
        const searchLower = params.searchTerm.toLowerCase();

        filtered = claims.filter((claim) =>
          String(claim.deathClaimId ?? "").includes(params.searchTerm) ||
          String(claim.memberId ?? "").includes(params.searchTerm) ||
          String(claim.stateId ?? "").includes(params.searchTerm) ||
          String(claim.designationId ?? "").includes(params.searchTerm) ||
          String(claim.nominee ?? "").toLowerCase().includes(searchLower) ||
          String(claim.nomineeRelation ?? "").toLowerCase().includes(searchLower) ||
          String(claim.amount ?? "").includes(params.searchTerm) ||
          String(claim.lastContribution ?? "").includes(params.searchTerm) ||
          String(claim.yearOF ?? "").includes(params.searchTerm) ||
          String(claim.deathDate ?? "").toLowerCase().includes(searchLower)
        );
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: filtered.slice(start, end),
        total: filtered.length,
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
