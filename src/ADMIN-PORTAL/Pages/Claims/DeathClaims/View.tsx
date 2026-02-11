import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import KiduView from "../../../Components/KiduView";
import MemberService from "../../../Services/Contributions/Member.services";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";
import YearMasterService from "../../../Services/Settings/YearMaster.services";

const DeathClaimView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "deathClaimId", label: "Death Claim ID", icon: "bi-hash" },
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
    { key: "yearName", label: "Year", icon: "bi-calendar-check" }, 
  ];

const formatDateOnly = (value?: string | Date) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN");
};

  const handleFetch = async (id: string) => {
  const response = await DeathClaimService.getDeathClaimById(Number(id));
  const claim = response.value;

  if (!claim) return response;

  claim.deathDate = formatDateOnly(claim.deathDate);
  claim.dddate = formatDateOnly(claim.dddate);

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

  if (claim.yearOF) {
    const year = await YearMasterService.getYearMasterById(claim.yearOF);
    claim.yearName = year.value?.yearName || claim.yearOF;
  }

  return {
    ...response,
    value: claim,
  };
};

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
      auditLogConfig={{ tableName: "DeathClaim", recordIdField: "deathClaimId", }}
      themeColor="#1B3763"
      loadingText="Loading death claim..."
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this death claim? This action cannot be undone."
      attachmentConfig={{ tableName: "DeathClaim", recordIdField:"deathClaimId" }}
    />
  );
};

export default DeathClaimView;
