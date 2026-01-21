// src/ADMIN-PORTAL/Components/Claims/RefundContributionCreate.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import type { Member } from "../../../Types/Contributions/Member.types";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";

const RefundContributionCreate: React.FC = () => {
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  /* ===================== FIELDS ===================== */
  const fields: Field[] = [
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4 } },
    { name: "branchNameOFTime", rules: { type: "text", label: "Branch Name (At the Time)", required: true, colWidth: 4 } },
    { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 4 } },
    { name: "type", rules: { type: "select", label: "Type", required: true, colWidth: 4 } },
    { name: "ddno", rules: { type: "text", label: "DD No", required: true, colWidth: 4 } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", colWidth: 4 } },
    { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },
    { name: "remark", rules: { type: "textarea", label: "Remark", colWidth: 4 } },
  ];

  const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

 const handleSubmit = async (formData: Record<string, any>) => {
  if (!selectedState) throw new Error("Please select State");
  if (!selectedMember) throw new Error("Please select Member");
  if (!selectedDesignation) throw new Error("Please select Designation");
  if(!selectedYearMaster) throw new Error("Please select Year");

  const payload = {
    staffNo: selectedMember.staffNo,
    stateId: selectedState.stateId,
    memberId: selectedMember.memberId,
    designationId: selectedDesignation.designationId,
    refundContribution: formData.type,
    refundNO: String(formData.refundNO || "").trim(),
    branchNameOFTime: String(formData.branchNameOFTime || "").trim(),
    dpcodeOfTime: String(formData.dpcodeOfTime || "").trim(),
    type: formData.type,
    remark: String(formData.remark || "").trim(),
    ddno: String(formData.ddno || "").trim(),
    dddate: toIso(formData.dddate),
    dddateString: toIso(formData.dddate),
    amount: Number(formData.amount),
    lastContribution: Number(formData.lastContribution || 0),
    yearOF: selectedYearMaster.yearOf,
    deathDate: "",
    deathDateString: "",
  };

  await RefundContributionService.createRefundContribution(
    payload as any
  );
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
    value: selectedYearMaster?.yearName || "",
    actualValue: selectedYearMaster?.yearOf,
    onOpen: () => setShowYearMasterPopup(true),
  },
};

//type options
  const typeOptions = [
    { value: "Refund", label: "Refund" },
    { value: "Loan", label: "Loan" },
    { value: "Emergency", label: "Emergency" },
  ];

  return (
    <>
      <KiduCreate
        title="Create Refund Contribution"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Refund"
        showResetButton
        successMessage="Refund created successfully!"
        errorMessage="Failed to create refund"
        popupHandlers={popupHandlers}
        options={{ type: typeOptions }}
        navigateOnSuccess="/dashboard/claims/refundcontribution-list"
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

export default RefundContributionCreate;
