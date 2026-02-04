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
      /* ================= DATA FETCH ================= */
      fetchService={async () => {
        const data: DeathClaim[] =
          await DeathClaimService.getAllDeathClaims();

        // ✅ Format death date once
        return data.map(d => ({
          ...d,
          deathDate: formatDateOnly(d.deathDate),
        }));
      }}

      /* ================= TABLE CONFIG ================= */
      columns={[
        { key: "deathClaimId", label: "Death Claim ID", type: "text" },
        { key: "memberName", label: "Member", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "deathDate", label: "Death Date", type: "text" },
        { key: "amount", label: "Amount", type: "text" },
        { key: "yearName", label: "Year", type: "text" },
      ]}

      /* ================= KEYS ================= */
      idKey="deathClaimId"

      /* ================= UI ================= */
      title="Death Claims"
      subtitle="Manage death claims with search, filter, and pagination."
      addButtonLabel="Add Death Claim"

      /* ================= ROUTES ================= */
      addRoute="/dashboard/claims/deathclaims-create"
      editRoute="/dashboard/claims/deathclaims-edit"
      viewRoute="/dashboard/claims/deathclaims-view"

      /* ================= FEATURES ================= */
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}

      /* ================= PAGINATION ================= */
      rowsPerPage={10}
    />
  );
};

export default DeathClaimList;
