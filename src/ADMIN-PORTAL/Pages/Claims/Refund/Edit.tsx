import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import type { RefundContribution } from "../../../Types/Claims/Refund.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation";
import type { Member } from "../../../Types/Contributions/Member.types";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import MemberService from "../../../Services/Contributions/Member.services";
import StateService from "../../../Services/Settings/State.services";
import DesignationService from "../../../Services/Settings/Designation.services";
import YearMasterService from "../../../Services/Settings/YearMaster.services";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";

const RefundContributionEdit: React.FC = () => {
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

  const typeOptions = [
    { value: "Refund", label: "Refund" },
    { value: "Loan", label: "Loan" },
    { value: "Emergency", label: "Emergency" },
  ];

  const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleFetch = async (id: string) => {
    const response = await RefundContributionService.getRefundContributionById(Number(id));
    const refund = response.value;
    if (!refund) return response;

    if (refund.stateId) {
      const state = await StateService.getStateById(refund.stateId);
      setSelectedState(state.value);
    }

    if (refund.staffNo) {
      const members = await MemberService.getAllMembers();
      const member = members.find(m => m.staffNo === refund.staffNo);
      if (member) setSelectedMember(member);
    }

    if (refund.designationId) {
      const designation = await DesignationService.getDesignationById(refund.designationId);
      setSelectedDesignation(designation.value);
    }

    if(refund.yearOF) {
       const year = await YearMasterService.getYearMasterById(refund.yearOF);
       setSelectedYearMaster(year.value);
    }
    return response;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedState || !selectedMember || !selectedDesignation ||! selectedYearMaster) {
      throw new Error("Please select all required values");
    }
    const payload: Partial<Omit<RefundContribution, "auditLogs">> = {
      refundContributionId: Number(id), 
      staffNo: selectedMember.staffNo,
      stateId: selectedState.stateId,
      memberId: selectedMember.memberId,
      designationId: selectedDesignation.designationId,
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
      yearOF: selectedYearMaster?.yearOf,
      deathDate: "",
      deathDateString: "",
    };

    await RefundContributionService.updateRefundContribution(Number(id), payload);
  };

  /* ===================== POPUPS ===================== */
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

  return (
    <>
      <KiduEdit
        title="Edit Refund Contribution"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        submitButtonText="Update Refund"
        showResetButton
        paramName="refundContributionId"
        successMessage="Refund updated successfully!"
        errorMessage="Failed to update refund. Please try again."
        loadingText="Loading Refund Contribution..."
        navigateBackPath="/dashboard/claims/refundcontribution-list"
        auditLogConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
        popupHandlers={popupHandlers}
        options={{ type: typeOptions }}
        themeColor="#1B3763"
        attachmentConfig={{
          tableName: "RefundContribution",
          recordIdField: "refundContributionId"
        }}
      />
      <StatePopup 
       show={showStatePopup} 
       handleClose={() => setShowStatePopup(false)} 
       onSelect={setSelectedState} 
       />
      <MemberPopup 
       show={showMemberPopup} 
       handleClose={() => setShowMemberPopup(false)} 
       onSelect={setSelectedMember} 
       />
      <DesignationPopup 
       show={showDesignationPopup} 
       handleClose={() => setShowDesignationPopup(false)} 
       onSelect={setSelectedDesignation} 
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

export default RefundContributionEdit;
