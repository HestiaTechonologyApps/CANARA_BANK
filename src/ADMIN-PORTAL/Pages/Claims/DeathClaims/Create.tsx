// src/ADMIN-PORTAL/Pages/Claims/DeathClaims/DeathClaimCreate.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import type { DeathClaim } from "../../../Types/Claims/DeathClaims.type";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";

const DeathClaimCreate: React.FC = () => {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "deathDate", rules: { type: "date", label: "Death Date", required: true, colWidth: 4 } },
    { name: "nominee", rules: { type: "text", label: "Nominee Name", required: true, colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "select", label: "Nominee Relation", required: true, colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", colWidth: 4 } },
    { name: "ddno", rules: { type: "text", label: "DD Number", required: true, colWidth: 4 } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", required: true, colWidth: 4 } },
    { name: "yearOF", rules: { type: "number", label: "Year Of", required: true, colWidth: 4 } },
  ];

  const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedMember) throw new Error("Please select a member");
    if (!selectedState) throw new Error("Please select a state");
    if (!selectedDesignation) throw new Error("Please select a designation");

    const payload = {
      memberId: selectedMember.memberId,
      stateId: selectedState.stateId,
      designationId: selectedDesignation.designationId,
      deathDate: toIso(formData.deathDate),
      nominee: formData.nominee.trim(),
      nomineeRelation: formData.nomineeRelation,
      nomineeIDentity: formData.nomineeIDentity?.trim() || "",
      ddno: formData.ddno.trim(),
      dddate: toIso(formData.dddate),
      amount: Number(formData.amount),
      lastContribution: Number(formData.lastContribution),
      yearOF: Number(formData.yearOF),
    } as Omit<DeathClaim, "deathClaimId" | "auditLogs">;

    await DeathClaimService.createDeathClaim(payload);
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
      <KiduCreate
        title="Create Death Claim"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Death Claim"
        showResetButton
        successMessage="Death claim created successfully!"
        errorMessage="Failed to create death claim.Please try again"
        navigateOnSuccess="/dashboard/claims/deathclaims-list"
        navigateDelay={1200}
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
        options={{ nomineeRelation: nomineeRelationOptions }}
      />

      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={(m) => {
          setSelectedMember(m);
          setShowMemberPopup(false);
        }}
      />

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(s) => {
          setSelectedState(s);
          setShowStatePopup(false);
        }}
      />

      <DesignationPopup
        show={showDesignationPopup}
        handleClose={() => setShowDesignationPopup(false)}
        onSelect={(d) => {
          setSelectedDesignation(d);
          setShowDesignationPopup(false);
        }}
      />
    </>
  );
};

export default DeathClaimCreate;
