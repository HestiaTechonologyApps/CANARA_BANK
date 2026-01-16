import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import MemberService from "../../../Services/Contributions/Member.services";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";
import type { DeathClaim } from "../../../Types/Claims/DeathClaims.type";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";

const DeathClaimEdit: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 3 } },
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 3 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 3 } },
    { name: "deathDate", rules: { type: "date", label: "Death Date", required: true, colWidth: 4 } },
    { name: "nominee", rules: { type: "text", label: "Nominee", required:true,colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "select", label: "Nominee Relation",required:true, colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", colWidth: 6 } },
    { name: "ddno", rules: { type: "text", label: "DD Number", colWidth: 3 } },
    { name: "dddate", rules: { type: "date", label: "DD Date",required:true, colWidth: 3 } },
    { name: "amount", rules: { type: "number", label: "Amount",required:true, colWidth: 3 } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", required:true,colWidth: 3 } },
    { name: "yearOF", rules: { type: "number", label: "Year Of",required:true, colWidth: 3 } },
  ];

  const toIso = (v?: string) => (v ? `${v}T00:00:00` : "");
  const toDateOnly = (v?: string) => (v ? v.split("T")[0] : "");

  // ✅ FETCH (NO MUTATION)
  const handleFetch = async (id: string) => {
    const response = await DeathClaimService.getDeathClaimById(Number(id));
    const claim = response.value;

    if (!claim) return response;

    if (claim.memberId) {
      const members = await MemberService.getAllMembers();
      setSelectedMember(members.find(m => m.memberId === claim.memberId) || null);
    }

    if (claim.stateId) {
      const stateRes = await StateService.getStateById(claim.stateId);
      setSelectedState(stateRes.value);
    }

    if (claim.designationId) {
      const desigRes = await DesignationService.getDesignationById(claim.designationId);
      setSelectedDesignation(desigRes.value);
    }

    return {
      ...response,
      value: {
        ...claim,
        deathDate: toDateOnly(claim.deathDate as string),
        dddate: toDateOnly(claim.dddate as string),
      },
    };
  };

 const handleUpdate = async (id: string, formData: Record<string, any>) => {
  if (!selectedMember || !selectedState || !selectedDesignation) {
    throw new Error("Please select all required values");
  }

  const payload: Omit<
    DeathClaim,
    | "auditLogs"
    | "memberName"
    | "stateName"
    | "designationName"
  > = {
    deathClaimId: Number(id),
    memberId: selectedMember.memberId,
    stateId: selectedState.stateId,
    designationId: selectedDesignation.designationId,

    deathDate: toIso(formData.deathDate),
    nominee: formData.nominee || "",
    nomineeRelation: formData.nomineeRelation || "",
    nomineeIDentity: formData.nomineeIDentity || "",

    ddno: formData.ddno || "",
    dddate: toIso(formData.dddate),

    amount: Number(formData.amount),
    lastContribution: Number(formData.lastContribution || 0),
    yearOF: Number(formData.yearOF),
  };

  await DeathClaimService.updateDeathClaim(Number(id), payload);
};


  const popupHandlers = {
    memberId: {
      value: selectedMember?.name || "",
      actualValue: selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
    stateId: {
      value: selectedState?.name || "",
      actualValue: selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => setShowDesignationPopup(true),
    },
  };

  const nomineeRelationOptions = [
    { value: "Spouse", label: "Spouse" },
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Son", label: "Son" },
    { value: "Daughter", label: "Daughter" },
    { value: "Sibling", label: "Sibling" },
    { value: "Nephew", label: "Nephew" },
    { value: "Niece", label: "Niece" },
    { value: "Grandparent", label: "Grandparent" },
  ];

  return (
    <>
      <KiduEdit
        title="Edit Death Claim"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="deathClaimId"
        navigateBackPath="/dashboard/claims/deathclaims-list"
        auditLogConfig={{ tableName: "DeathClaim", recordIdField: "deathClaimId" }}
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
        options={{ nomineeRelation: nomineeRelationOptions }}
      />

      <MemberPopup show={showMemberPopup} handleClose={() => setShowMemberPopup(false)} onSelect={setSelectedMember} />
      <StatePopup show={showStatePopup} handleClose={() => setShowStatePopup(false)} onSelect={setSelectedState} />
      <DesignationPopup show={showDesignationPopup} handleClose={() => setShowDesignationPopup(false)} onSelect={setSelectedDesignation} />
    </>
  );
};

export default DeathClaimEdit;
