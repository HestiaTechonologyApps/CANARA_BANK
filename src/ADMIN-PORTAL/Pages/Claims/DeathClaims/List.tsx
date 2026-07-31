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
      paginatedFetchService={async (params) => {
        return DeathClaimService.getPagedDeathClaims({
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          searchTerm: params.searchTerm,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        });
      }}
    
      transformData={(data: DeathClaim[]) =>
        data.map(d => ({
          ...d,
          deathDate: formatDateOnly(d.deathDate),
          _disableEdit: d.isApproved === true,
        }))
      }

      columns={[
        { key: "deathClaimId", label: "Death Claim ID", type: "text" },
        { key: "memberName", label: "Member", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "deathDate", label: "Death Date", type: "text" },
        { key: "amount", label: "Amount", type: "text" },
        { key: "yearName", label: "Year", type: "text" },
        { key: "isApproved", label: "Approved", type: "checkbox" },
      ]}

      filterColumns={[
        { key: "deathClaimId", label: "Death Claim ID", type: "text" },
        { key: "memberName", label: "Member", type: "text" },
        { key: "stateName", label: "State", type: "text" },
        { key: "designationName", label: "Designation", type: "text" },
        { key: "deathDate", label: "Death Date", type: "date" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "yearName", label: "Year", type: "text" },
        { key: "isApproved", label: "Approved", type: "text" },
      ]}
      
      idKey="deathClaimId"
      title="Death Claims"
      subtitle="Manage death claims with search, filter, and pagination."
      addButtonLabel="Add New"
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
