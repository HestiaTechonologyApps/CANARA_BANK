// src/ADMIN-PORTAL/Pages/Contributions/RefundContribution/RefundContributionEdit.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import type { RefundContribution } from "../../../Types/Claims/Refund.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import MemberService from "../../../Services/Contributions/Member.services";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";


const RefundContributionEdit: React.FC = () => {

     const [showStatePopup, setShowStatePopup] = useState(false);
     const [showMemberPopup, setShowMemberPopup] = useState(false);
    const[showDesignationPopup,setShowDesignationPopup]=useState(false);
       
       const [selectedState, setSelectedState] = useState<State | null>(null);
       const [selectedMember, setSelectedMember] = useState<Member | null>(null);
       const[selectedDesignation,setSelectedDesignation]=useState<Designation|null>(null);
     
  const fields: Field[] = [
    //{ name: "refundContributionId", rules: { type: "number", label: "Refund Contribution ID", required: false, disabled: true, colWidth: 3 } },
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4 } },
    { name: "branchNameOFTime", rules: { type: "text", label: "Branch Name (At the Time)", required: true, colWidth: 4 } },
    { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 4 } },
    { name: "type", rules: { type: "select", label: "Type", required: true, colWidth: 4 } },
    { name: "remark", rules: { type: "textarea", label: "Remark", required: false, colWidth: 6 } },
    { name: "ddno", rules: { type: "text", label: "DD No", required: true, colWidth: 4 } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", required: false, colWidth: 4 } },
    { name: "yearOF", rules: { type: "number", label: "Year Of", required: true, colWidth: 4 } },
  ];
  const typeOptions = [
    { value: "Refund", label: "Refund" },
    { value: "Loan", label: "Loan" },
    { value: "Emergency", label: "Emergency" },
  ];

 const handleFetch = async (id: string) => {
  const response = await RefundContributionService.getRefundContributionById(Number(id));
  const refund = response.value;

  if (!refund) return response;

  // ================= STATE =================
  if (refund.stateId) {
    const state = await StateService.getStateById(refund.stateId);
    setSelectedState(state.value);
    refund.stateId = state.value.stateId; // 🔑 IMPORTANT
  }

  // ================= MEMBER (KEY FIX) =================
  if (refund.staffNo) {
    const members = await MemberService.getAllMembers();
    const member = members.find(m => m.staffNo === refund.staffNo);
    if (member) {
      setSelectedMember(member);
      refund.memberId = member.memberId; // 🔥 THIS LINE FIXES IT
    }
  }

  // ================= DESIGNATION =================
  if (refund.designationId) {
    const designation = await DesignationService.getDesignationById(refund.designationId);
    setSelectedDesignation(designation.value);
    refund.designationId = designation.value.designationId;
  }

  return {
    ...response,
    value: refund, 
  };
};

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if(!selectedState || !selectedMember || !selectedDesignation){
      throw new Error("Please select all required values");
    }
   const payload: Omit<RefundContribution, "auditLogs"> = {
  refundContributionId: Number(id),
  stateId: selectedState.stateId,
  memberId: selectedMember.memberId,
  staffNo: selectedMember.staffNo,
  designationId: selectedDesignation.designationId,
  refundNO: formData.refundNO?.trim(),
  branchNameOFTime: formData.branchNameOFTime?.trim(),
  dpcodeOfTime: formData.dpcodeOfTime?.trim(),
  type: formData.type,
  remark: formData.remark?.trim(),
  ddno: formData.ddno?.trim(),
  dddate: formData.dddate,
  dddateString: formData.dddate,
  amount: Number(formData.amount),
  lastContribution: Number(formData.lastContribution || 0),
  yearOF: Number(formData.yearOF),
  deathDate: "",
  deathDateString: "",
};

    await RefundContributionService.updateRefundContribution(Number(id), payload);
  };

 const popupHandlers = {
    stateId: {
      value: selectedState?.name || "",
      actualValue: selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
    memberId: {
  value: selectedMember ? `${selectedMember.staffNo} - ${selectedMember.name}` : "",
  actualValue: selectedMember?.memberId,
  onOpen: () => setShowMemberPopup(true),
},
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => setShowDesignationPopup(true),
    },
  };

  return (
   <>
      <KiduEdit
        title="Edit Refund Contribution"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="refundContributionId"
        successMessage="Refund Contribution updated successfully!"
        errorMessage="Failed to update Refund Contribution."
        navigateBackPath="/dashboard/claims/refundcontribution-list"
        auditLogConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
        themeColor="#1B3763"
         popupHandlers={popupHandlers}
         options={{ type: typeOptions }}
      />
   <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={setSelectedState}
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
        onSelect={setSelectedDesignation}
      />
   </>
  );
};

export default RefundContributionEdit;
