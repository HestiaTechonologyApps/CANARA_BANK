import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import DeathClaimService from "../../../Services/Claims/DeathClaims.services";
import MemberService from "../../../Services/Contributions/Member.services";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";
import YearMasterService from "../../../Services/Settings/YearMaster.services";
import type { DeathClaim } from "../../../Types/Claims/DeathClaims.type";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";

const DeathClaimEdit: React.FC = () => {
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

  const toIso = (v?: string) => (v ? `${v}T00:00:00` : "");
  const toDateOnly = (v?: string) => (v ? v.split("T")[0] : "");

  // ================= FETCH =================
  const handleFetch = async (id: string) => {
    const response = await DeathClaimService.getDeathClaimById(Number(id));
    const claim = response.value;
    if (!claim) return response;

    if (claim.stateId) {
      const state = await StateService.getStateById(claim.stateId);
      setSelectedState(state.value);
    }

    if (claim.memberId) {
      const members = await MemberService.getAllMembers();
      const member = members.find(m => m.memberId === claim.memberId);
      if (member) setSelectedMember(member);
    }

    if (claim.designationId) {
      const desig = await DesignationService.getDesignationById(claim.designationId);
      setSelectedDesignation(desig.value);
    }

    if (claim.yearOF) {
      const year = await YearMasterService.getYearMasterById(claim.yearOF);
      setSelectedYearMaster(year.value);
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
    if (!selectedState || !selectedMember || !selectedDesignation || !selectedYearMaster) {
      throw new Error("Please select all required values");
    }

const payload: Partial<Omit<DeathClaim, "auditLogs">> = {
  
  deathClaimId: Number(id),
  staffNo: String(selectedMember.staffNo),
  memberId: selectedMember.memberId,
  stateId: selectedState.stateId,
  designationId: selectedDesignation.designationId,
  deathDate: toIso(formData.deathDate),
  nominee: String(formData.nominee || "").trim(),
  nomineeRelation: formData.nomineeRelation,
  nomineeIDentity: String(formData.nomineeIDentity || "").trim(),
  ddno: String(formData.ddno || "").trim(),
  dddate: toIso(formData.dddate),
  amount: Number(formData.amount),
  lastContribution: Number(formData.lastContribution || 0),
  yearOF: selectedYearMaster.yearOf,
};

    await DeathClaimService.updateDeathClaim(Number(id), payload);
  };

  // ================= POPUPS =================
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
      value: selectedYearMaster ? String(selectedYearMaster.yearName) : "",
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
      <KiduEdit
        title="Edit Death Claim"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="deathClaimId"
        submitButtonText="Update Death Claim"
        showResetButton
        successMessage="Death Claim updated successfully!"
        errorMessage="Failed to update Death Claim. Please try again."
        loadingText="Loading Death Claim..."
        navigateBackPath="/dashboard/claims/deathclaims-list"
        auditLogConfig={{ tableName: "DeathClaim", recordIdField: "deathClaimId" }}
        popupHandlers={popupHandlers}
        options={{ nomineeRelation: nomineeRelationOptions }}
        themeColor="#1B3763"
        attachmentConfig={{
          tableName: "DeathClaim",
          recordIdField:"deathClaimId"
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

export default DeathClaimEdit;
