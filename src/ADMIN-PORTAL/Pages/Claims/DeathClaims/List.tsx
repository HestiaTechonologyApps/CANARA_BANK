import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import type { DeathClaim } from "../../../Types/Claims/DeathClaims.type";

const columns = [
  { key: "deathClaimId", label: "Death Claim ID", type: "text" as const },
  { key: "memberName", label: "Member", type: "text" as const },
  { key: "stateName", label: "State", type: "text" as const },
  { key: "designationName", label: "Designation", type: "text" as const },
  { key: "deathDate", label: "Death Date", type: "text" as const },
  { key: "amount", label: "Amount", type: "text" as const },
  { key: "yearName", label: "Year", type: "text" as const }, 
];

const formatDateOnly = (value?: string | Date) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN");
};

const DeathClaimList: React.FC = () => {
 const fetchData = async ({ pageNumber, pageSize, searchTerm }: any) => {
  let data: DeathClaim[] = await DeathClaimService.getAllDeathClaims();

  // ✅ Date-only formatting
  data = data.map(d => ({
    ...d,
    deathDate: formatDateOnly(d.deathDate),
  }));

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    data = data.filter(d =>
      [
        d.memberName,
        d.stateName,
        d.designationName,
        d.yearName?.toString(),
      ]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }

  return {
    data: data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    total: data.length,
  };
};

  return (
    <KiduServerTable
      title="Death Claims"
      subtitle="Manage death claims with search, filter, and pagination."
      columns={columns}
      idKey="deathClaimId"
      addButtonLabel="Add Death Claim"
      addRoute="/dashboard/claims/deathclaims-create"
      editRoute="/dashboard/claims/deathclaims-edit"
      viewRoute="/dashboard/claims/deathclaims-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      rowsPerPage={10}
      fetchData={fetchData}
    />
  );
};

export default DeathClaimList;
