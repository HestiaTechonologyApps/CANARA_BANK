import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import type { Member } from "../../../Types/Contributions/Member.types";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";

const DeathClaimCreate: React.FC = () => {
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const fields: Field[] = [
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "deathDate", rules: { type: "date", label: "Death Date", required: true, colWidth: 4 } },
    { name: "nominee", rules: { type: "text", label: "Nominee Name", required: true, colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "select", label: "Nominee Relation", required: true, colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", colWidth: 4 } },
    { name: "ddno", rules: { type: "text", label: "DD Number", required: true, colWidth: 4 } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", colWidth: 4 } },
    { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },
  ];

  const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedState) throw new Error("Please select State");
    if (!selectedMember) throw new Error("Please select Member");
    if (!selectedDesignation) throw new Error("Please select Designation");
    if (!selectedYearMaster) throw new Error("Please select Year");

    const payload = {
      staffNo: selectedMember.staffNo,
      stateId: selectedState.stateId,
      memberId: selectedMember.memberId,
      designationId: selectedDesignation.designationId,

      deathDate: toIso(formData.deathDate),
      deathDateString: toIso(formData.deathDate),

      nominee: String(formData.nominee || "").trim(),
      nomineeRelation: formData.nomineeRelation,
      nomineeIDentity: String(formData.nomineeIDentity || "").trim(),

      ddno: String(formData.ddno || "").trim(),
      dddate: toIso(formData.dddate),
      dddateString: toIso(formData.dddate),

      amount: Number(formData.amount),
      lastContribution: Number(formData.lastContribution || 0),

      yearOF: selectedYearMaster.yearOf,
    };

    await DeathClaimService.createDeathClaim(payload as any);
  };

  const popupHandlers = {
    stateId: {
      value: selectedState?.name || "",
      actualValue: selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
    memberId: {
      value: selectedMember?.name || "",
      actualValue: selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => setShowDesignationPopup(true),
    },
    yearOF: {
      value: selectedYearMaster
        ? String(selectedYearMaster.yearName)
        : "",
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
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
        errorMessage="Failed to create death claim. Please try again."
        popupHandlers={popupHandlers}
        options={{ nomineeRelation: nomineeRelationOptions }}
        navigateOnSuccess="/dashboard/claims/deathclaims-list"
        themeColor="#1B3763"
      />

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(s) => {
          setSelectedState(s);
          setShowStatePopup(false);
        }}
      />

      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={(m) => {
          setSelectedMember(m);
          setShowMemberPopup(false);
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

      <YearMasterPopup
        show={showYearMasterPopup}
        handleClose={() => setShowYearMasterPopup(false)}
        onSelect={(y) => {
          setSelectedYearMaster(y);
          setShowYearMasterPopup(false);
        }}
      />
    </>
  );
};

export default DeathClaimCreate;
