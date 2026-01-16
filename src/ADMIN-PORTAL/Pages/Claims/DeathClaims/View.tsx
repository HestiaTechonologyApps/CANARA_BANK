import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import KiduView from "../../../Components/KiduView";
import MemberService from "../../../Services/Contributions/Member.services";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";

const DeathClaimView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "deathClaimId", label: "Claim ID", icon: "bi-hash" },
    { key: "memberName", label: "Member", icon: "bi-person" },
    { key: "stateName", label: "State", icon: "bi-flag" },
    { key: "designationName", label: "Designation", icon: "bi-briefcase" },

    { key: "deathDate", label: "Death Date", icon: "bi-calendar-event" },
    { key: "nominee", label: "Nominee", icon: "bi-person-heart" },
    { key: "nomineeRelation", label: "Nominee Relation", icon: "bi-people" },
    { key: "nomineeIDentity", label: "Nominee Identity", icon: "bi-person-badge" },

    { key: "ddno", label: "DD Number", icon: "bi-receipt" },
    { key: "dddate", label: "DD Date", icon: "bi-calendar" },
    { key: "amount", label: "Amount", icon: "bi-cash" },
    { key: "lastContribution", label: "Last Contribution", icon: "bi-wallet2" },
    { key: "yearOF", label: "Year Of", icon: "bi-calendar-check" },
  ];

  // ✅ FETCH (normalized like MemberView)
  const handleFetch = async (id: string) => {
    const response = await DeathClaimService.getDeathClaimById(Number(id));
    const claim = response.value;

    if (!claim) return response;

    if (claim.memberId) {
      const members = await MemberService.getAllMembers();
      const member = members.find(m => m.memberId === claim.memberId);
      claim.memberName = member?.name || "N/A";
    }

    if (claim.stateId) {
      const state = await StateService.getStateById(claim.stateId);
      claim.stateName = state.value?.name || "N/A";
    }

    if (claim.designationId) {
      const desig = await DesignationService.getDesignationById(claim.designationId);
      claim.designationName = desig.value?.name || "N/A";
    }

    return {
      ...response,
      value: claim,
    };
  };

  // ✅ DELETE HANDLER (THIS WAS MISSING / WRONG)
  const handleDelete = async (id: string) => {
    await DeathClaimService.deleteDeathClaim(Number(id));
  };

  return (
    <KiduView
      title="Death Claim Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}       
      editRoute="/dashboard/claims/deathclaims-edit"
      listRoute="/dashboard/claims/deathclaims-list"
      paramName="deathClaimId"         
      auditLogConfig={{
        tableName: "DeathClaim",
        recordIdField: "deathClaimId",
      }}
      themeColor="#1B3763"
      showEditButton={true}
      showDeleteButton={true}          
      deleteConfirmMessage="Are you sure you want to delete this death claim? This action cannot be undone."
    />
  );
};

export default DeathClaimView;
