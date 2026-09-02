import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Member } from "../../Types/Contributions/Member.types";
import type { State } from "../../Types/Settings/States.types";
import type { Designation } from "../../Types/Settings/Designation.types";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import type { Field } from "../../Components/KiduEdit";
import DeathClaimService from "../../Services/Claims/DeathClaims.services";
import MemberService from "../../Services/Contributions/Member.services";
import StateService from "../../Services/Settings/State.services";
import DesignationService from "../../Services/Settings/Designation.services";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import AuthService from "../../../Services/Auth.services";
import KiduEdit from "../../Components/KiduEdit";

const THEME_COLOR = "#1B3763";

const DeathClaimApprovalEdit: React.FC = () => {
  const navigate = useNavigate();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const fields: Field[] = [
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4, disabled: true } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4, disabled: true } },
    { name: "deathDate", rules: { type: "date", label: "Death Date", required: true, colWidth: 4, disabled: true } },
    { name: "nominee", rules: { type: "text", label: "Nominee Name", required: true, colWidth: 4, disabled: true } },
    { name: "nomineeRelation", rules: { type: "text", label: "Nominee Relation", required: true, colWidth: 4, disabled: true } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", colWidth: 4, disabled: true } },
    { name: "ddno", rules: { type: "text", label: "DD Number", required: true, colWidth: 4, disabled: true } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4, disabled: true } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4, disabled: true } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", colWidth: 4, disabled: true } },
    { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 4, disabled: true } },
  ];

  const toDateOnly = (v?: string) => (v ? v.split("T")[0] : "");

  const handleFetch = async (id: string) => {
    const response = await DeathClaimService.getDeathClaimById(Number(id));
    const claim = response.value;
    if (!claim) return response;

    if (claim.stateId) {
      const state = (await StateService.getStateById(claim.stateId)).value;
      setSelectedState(state);
    }
    if (claim.memberId) {
      const member = (await MemberService.getMemberById(claim.memberId)).value;
      setSelectedMember(member);
    }
    if (claim.designationId) {
      const designation = (await DesignationService.getDesignationById(claim.designationId)).value;
      setSelectedDesignation(designation);
    }
    if (claim.yearOF) {
      const year = (await YearMasterService.getYearMasterById(claim.yearOF)).value;
      setSelectedYearMaster(year);
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

  // No-op: this page never submits field changes. Approve/Reject only.
  const handleUpdate = async () => {
    throw new Error("This record is read-only. Use Approve or Reject.");
  };

  const getCurrentUserId = (): number => {
    const user = AuthService.getCurrentUser();
    if (!user?.userId) throw new Error("Unable to get current user. Please login again.");
    return user.userId;
  };

  const handleApprove = async (id: string) => {
    const currentUserId = getCurrentUserId();
    await DeathClaimService.approveDeathClaim(Number(id), { approve: true, currentUserId });
    navigate("/dashboard/approval-list?tab=deathClaim");
  };

  const handleReject = async (id: string) => {
    const currentUserId = getCurrentUserId();
    await DeathClaimService.approveDeathClaim(Number(id), { approve: false, currentUserId });
    navigate("/dashboard/approval-list?tab=deathClaim");
  };

  const popupHandlers = {
    stateId: { value: selectedState?.name || "", actualValue: selectedState?.stateId, onOpen: () => {} },
    memberId: { value: selectedMember?.name || "", actualValue: selectedMember?.memberId, onOpen: () => {} },
    designationId: { value: selectedDesignation?.name || "", actualValue: selectedDesignation?.designationId, onOpen: () => {} },
    yearOF: { value: selectedYearMaster ? String(selectedYearMaster.yearName) : "", actualValue: selectedYearMaster?.yearOf, onOpen: () => {} },
  };

  return (
    <KiduEdit
      title="Review Death Claim"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      showResetButton={false}
      paramName="deathClaimId"
      navigateBackPath="/dashboard/approval-list?tab=deathClaim"
      auditLogConfig={{ tableName: "DEATH_CLAIM", recordIdField: "deathClaimId" }}
      popupHandlers={popupHandlers}
      themeColor={THEME_COLOR}
      approvalConfig={{
        onApprove: handleApprove,
        onReject: handleReject,
        confirmApproveText: "Are you sure you want to approve this death claim?",
        confirmRejectText: "Are you sure you want to reject this death claim?",
        showWhen: (formData) => !formData.isApproved,
      }}
    />
  );
};

export default DeathClaimApprovalEdit;