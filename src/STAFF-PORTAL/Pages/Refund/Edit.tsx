import React, { useState } from "react";
import type { State } from "../../../ADMIN-PORTAL/Types/Settings/States.types";
import type { Member } from "../../../ADMIN-PORTAL/Types/Contributions/Member.types";
import type { Designation } from "../../../ADMIN-PORTAL/Types/Settings/Designation.types";
import type { YearMaster } from "../../../ADMIN-PORTAL/Types/Settings/YearMaster.types";
import type { Field } from "../../../ADMIN-PORTAL/Components/KiduEdit";
import RefundContributionService from "../../../ADMIN-PORTAL/Services/Claims/Refund.services";
import StateService from "../../../ADMIN-PORTAL/Services/Settings/State.services";
import MemberService from "../../../ADMIN-PORTAL/Services/Contributions/Member.services";
import DesignationService from "../../../ADMIN-PORTAL/Services/Settings/Designation.services";
import YearMasterService from "../../../ADMIN-PORTAL/Services/Settings/YearMaster.services";
import type { RefundContribution } from "../../../ADMIN-PORTAL/Types/Claims/Refund.types";
import KiduEdit from "../../../ADMIN-PORTAL/Components/KiduEdit";
import StatePopup from "../../../ADMIN-PORTAL/Pages/Settings/State/StatePopup";
//import MemberPopup from "../../../ADMIN-PORTAL/Pages/Contributions/Member/MemberPopup";
//import DesignationPopup from "../../../ADMIN-PORTAL/Pages/Settings/Designation/DesignationPopup";
import YearMasterPopup from "../../../ADMIN-PORTAL/Pages/YearMaster/YearMasterPopup";
import type { Branch } from "../../../ADMIN-PORTAL/Types/Settings/Branch.types";
import BranchPopup from "../../../ADMIN-PORTAL/Pages/Branch/BranchPopup";

const MemberRefundContributionEdit: React.FC = () => {
  const [showStatePopup, setShowStatePopup] = useState(false);
  //const [showMemberPopup, setShowMemberPopup] = useState(false);
  //const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const [initialState, setInitialState] = useState<State | null>(null);
  const [initialMember, setInitialMember] = useState<Member | null>(null);
  const [initialDesignation, setInitialDesignation] = useState<Designation | null>(null);
  const [initialYearMaster, setInitialYearMaster] = useState<YearMaster | null>(null);

  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [initialBranch, setInitialBranch] = useState<Branch | null>(null);

  const fields: Field[] = [
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4, disabled: true } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4 } },
    { name: "branchNameOFTime", rules: { type: "popup", label: "Branch Name (At the Time)", required: true, colWidth: 4 } },
    { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 4, disabled: true } },
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
    const state = (await StateService.getStateById(refund.stateId)).value;
    setSelectedState(state);
    setInitialState(state); 
  }

  if (refund.staffNo) {
    const memberRes = await MemberService.getMembersPaginated({
      pageNumber: 1,
      pageSize: 1,
      searchTerm: String(refund.staffNo),
    });
    const member = memberRes?.data?.[0] || null;
    setSelectedMember(member);
    setInitialMember(member);
  }

  if (refund.branchNameOFTime) {
  const branchFromSnapshot = {
    branchId: 0,
    dpCode: Number(refund.dpcodeOfTime) || 0,
    name: refund.branchNameOFTime,
  } as Branch;
  setSelectedBranch(branchFromSnapshot);
  setInitialBranch(branchFromSnapshot);
}

  if (refund.designationId) {
    const designation = (await DesignationService.getDesignationById(refund.designationId)).value;
    setSelectedDesignation(designation);
    setInitialDesignation(designation); 
  }

  if (refund.yearOF) {
    const year = (await YearMasterService.getYearMasterById(refund.yearOF)).value;
    setSelectedYearMaster(year);
    setInitialYearMaster(year); 
  }

  return {
    ...response,
    value: {
      ...refund,
      dddate: refund.dddate ? String(refund.dddate).split("T")[0] : "", 
    },
  };
};
 const handleReset = () => {    
    setSelectedState(initialState);
    setSelectedMember(initialMember);
    setSelectedDesignation(initialDesignation);
    setSelectedYearMaster(initialYearMaster);
    setSelectedBranch(initialBranch);
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedState || !selectedMember || !selectedDesignation ||! selectedYearMaster || !selectedBranch) {
      throw new Error("Please select all required values");
    }
    const payload: Partial<Omit<RefundContribution, "auditLogs">> = {
      refundContributionId: Number(id), 
      staffNo: selectedMember.staffNo,
      stateId: selectedState.stateId,
      memberId: selectedMember.memberId,
      designationId: selectedDesignation.designationId,
      refundNO: String(formData.refundNO || "").trim(),
      //branchNameOFTime: String(formData.branchNameOFTime || "").trim(),
      branchNameOFTime: selectedBranch.name,
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

const popupHandlers = {
    stateId: {
      value: selectedState?.name || "",
      actualValue: selectedState?.stateId,
      onOpen: () => setShowStatePopup(true),
    },
    memberId: {
      value: selectedMember?.name || "",
      actualValue: selectedMember?.memberId,
      onOpen: () => {}, 
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => {}, 
    },
    branchNameOFTime: {
  value: selectedBranch?.name || "",
  actualValue: selectedBranch?.name,
  onOpen: () => setShowBranchPopup(true),
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
      <style>{`
        .hide-search-btn input:disabled ~ button {
          display: none !important;
        }
        .hide-search-btn input:disabled {
          border-radius: 4px !important;
          background-color: #f5f5f5 !important;
          cursor: not-allowed;
        }
      `}</style>

      <div className="hide-search-btn">
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
          navigateBackPath="/staff-portal/refund-list"
          auditLogConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
          popupHandlers={popupHandlers}
          options={{ type: typeOptions }}
          themeColor="#1B3763"
          attachmentConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
          onReset={handleReset}
        />
      </div>

      <StatePopup 
       show={showStatePopup} 
       handleClose={() => setShowStatePopup(false)} 
       onSelect={setSelectedState} 
       />
        <YearMasterPopup
       show={showYearMasterPopup}
       handleClose={() => setShowYearMasterPopup(false)}
       onSelect={(y) => {
        setSelectedYearMaster(y);
        setShowYearMasterPopup(false);
     }}
     />
     <BranchPopup
  show={showBranchPopup}
  handleClose={() => setShowBranchPopup(false)}
  onSelect={(b) => {
    setSelectedBranch(b);
    setShowBranchPopup(false);
  }}
/>
    </>
  );
};

export default MemberRefundContributionEdit;
