import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";

const columns = [
  { key: "deathClaimId", label: "Death Claim ID", type: "text" as const },
  { key: "memberName", label: "Member", type: "text" as const },
  { key: "stateName", label: "State", type: "text" as const },
  { key: "designationName", label: "Designation", type: "text" as const },
  { key: "deathDate", label: "Death Date", type: "text" as const },
  { key: "amount", label: "Amount", type: "text" as const },
];

const DeathClaimList: React.FC = () => {
  const fetchData = async ({ pageNumber, pageSize, searchTerm }: any) => {
    let data = await DeathClaimService.getAllDeathClaims();

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(d =>
        [d.memberName, d.stateName, d.designationName]
          .filter(Boolean)
          .some(v => v.toLowerCase().includes(q))
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
