import React from "react";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import type { DeathClaim } from "../../../Types/Claims/DeathClaims.type";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const formatDateOnly = (value?: string | Date) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN");
};

const DeathClaimList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => {
        const data: DeathClaim[] =
          await DeathClaimService.getAllDeathClaims();
        return data.map(d => ({
          ...d,
          deathDate: formatDateOnly(d.deathDate),
        }));
      }}

      columns={[
        { key: "deathClaimId", label: "Death Claim ID", type: "text" },
        { key: "memberName", label: "Member", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "deathDate", label: "Death Date", type: "text" },
        { key: "amount", label: "Amount", type: "text" },
        { key: "yearName", label: "Year", type: "text" },
      ]}

      filterColumns={[
        { key: "deathClaimId", label: "Death Claim ID", type: "text" },
        { key: "memberName", label: "Member", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "deathDate", label: "Death Date", type: "date" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "yearName", label: "Year", type: "text" },
      ]}
      
      idKey="deathClaimId"
      title="Death Claims"
      subtitle="Manage death claims with search, filter, and pagination."
      addButtonLabel="Add Claims"
      addRoute="/dashboard/claims/deathclaims-create"
      editRoute="/dashboard/claims/deathclaims-edit"
      viewRoute="/dashboard/claims/deathclaims-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default DeathClaimList;
