import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit"; // ✅ from KiduEdit (not KiduCreate)
import type { DeathClaim } from "../../../Types/Claims/DeathClaims.type";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import KiduEdit from "../../../Components/KiduEdit";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import StatePopup from "../../Settings/State/StatePopup";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import MemberService from "../../../Services/Contributions/Member.services";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";

const DeathClaimEdit: React.FC = () => {

    const[showMemberPopup,setShowMemberPopup]=useState(false);
    const[showStatePopup,setShowStatePopup]=useState(false);
    const[showDesignationPopup,setShowDesignationPopup]=useState(false);
  
    const[selectedMember,setSelectedMember]=useState<Member|null>(null);
    const[selectedState,setSelectedState]=useState<State|null>(null);
    const[selectedDesignation,setSelectedDesignation]=useState<Designation|null>(null);
  
  const fields: Field[] = [
   // { name: "deathClaimId", rules: { type: "number", label: "Claim ID", required: false, disabled: true, colWidth: 3 } },
    { name: "memberId", rules: { type: "popup", label: "Member ID", required: true, colWidth: 3 } },
    { name: "stateId", rules: { type: "popup", label: "State ID", required: true, colWidth: 3 } },
    { name: "designationId", rules: { type: "popup", label: "Designation ID", required: true, colWidth: 3 } },
    { name: "deathDate", rules: { type: "date", label: "Death Date", required: true, colWidth: 4 } },
    { name: "nominee", rules: { type: "text", label: "Nominee Name", required: true, colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "text", label: "Nominee Relation", required: true, colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", required: false, colWidth: 6 } },
    { name: "ddno", rules: { type: "text", label: "DD Number", required: true, colWidth: 3 } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 3 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 3 } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", required: true, colWidth: 3 } },
    { name: "yearOF", rules: { type: "number", label: "Year Of", required: true, colWidth: 3 } },
  ];

 const handleFetch = async (claimId: string) => {
  const response = await DeathClaimService.getDeathClaimById(Number(claimId));
  const claim = response.value; 

  if (claim) {
   const member = await MemberService.getMemberById(claim.memberId);
   setSelectedMember(member.value);

   const state = await StateService.getStateById(claim.stateId);
   setSelectedState(state.value);

   const designation = await DesignationService.getDesignationById(claim.designationId);
   setSelectedDesignation(designation.value)
  }

  return response;
};


const handleUpdate = async (claimId: string, formData: Record<string, any>) => {
  if (!selectedMember) {
    throw new Error("Please select a member");
  }
  if (!selectedState) {
    throw new Error("Please select a state");
  }
  if (!selectedDesignation) {
    throw new Error("Please select a designation");
  }

  try {
    const deathClaimData: Omit<DeathClaim, "auditLogs"> = {
      deathClaimId: Number(claimId),
      memberId: selectedMember.memberId,
      stateId: selectedState.stateId,
      designationId: selectedDesignation.designationId,
      deathDate: formData.deathDate,
      nominee: formData.nominee.trim(),
      nomineeRelation: formData.nomineeRelation.trim(),
      nomineeIDentity: formData.nomineeIDentity?.trim() || "",
      ddno: formData.ddno.trim(),
      dddate: formData.dddate,
      amount: Number(formData.amount),
      lastContribution: Number(formData.lastContribution),
      yearOF: Number(formData.yearOF),
    };

    await DeathClaimService.updateDeathClaim(
      Number(claimId),
      deathClaimData
    );
  } catch (error) {
    console.error("Error updating death claim:", error);
    throw error;
  }
};

const popupHandlers = {
    memberId: {
      value: selectedMember?.name || "",
      actualValue:selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
    stateId: {
      value: selectedState?.name || "",
      actualValue:selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue:selectedDesignation?.designationId,
      onOpen: () => setShowDesignationPopup(true),
    },
}

  return (
    <>
      <KiduEdit
        title="Edit Death Claim"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        submitButtonText="Update Death Claim"
        showResetButton
        successMessage="Death claim updated successfully!"
        errorMessage="Failed to update death claim. Please try again."
        paramName="deathClaimId"
        navigateBackPath="/dashboard/claims/deathclaims-list"
        loadingText="Loading Death Claim..."
        auditLogConfig={{ tableName: "DeathClaim", recordIdField: "deathClaimId" }}
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
      />
      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={setSelectedMember}
      />
      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={setSelectedState}
      />
      <DesignationPopup
        show={showDesignationPopup}
        handleClose={() => setShowDesignationPopup(false)}
        onSelect={setSelectedDesignation}
      />
    </>
  );
};

export default DeathClaimEdit;
