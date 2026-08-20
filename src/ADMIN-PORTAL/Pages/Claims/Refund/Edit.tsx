import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import type { RefundContribution } from "../../../Types/Claims/Refund.types";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation.types";
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
import AuthService from "../../../../Services/Auth.services";
import type { Branch } from "../../../Types/Settings/Branch.types";
import BranchPopup from "../../Branch/BranchPopup";

const THEME_COLOR = "#1B3763";

const RefundContributionEdit: React.FC = () => {
  const navigate = useNavigate();
 // const { refundContributionId } = useParams();

  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
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
  const [presetValues, setPresetValues] = useState<Record<string, any>>({});

  const fields: Field[] = [
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4 } },
    { name: "branchNameOFTime", rules: { type: "popup", label: "Branch Name (At the Time)", required: true, colWidth: 4 } },
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

    if (refund.designationId) {
      const designation = (await DesignationService.getDesignationById(refund.designationId)).value;
      setSelectedDesignation(designation);
      setInitialDesignation(designation);
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

  const getCurrentUserId = (): number => {
    const user = AuthService.getCurrentUser();
    if (!user?.userId) throw new Error("Unable to get current user. Please login again.");
    return user.userId;
  };

  const handleApprove = async (id: string) => {
    const currentUserId = getCurrentUserId();
    await RefundContributionService.approveRefundContribution(Number(id), { approve: true, currentUserId });
    navigate("/dashboard/claims/refundcontribution-list");
  };

  const handleReject = async (id: string) => {
    const currentUserId = getCurrentUserId();
    await RefundContributionService.approveRefundContribution(Number(id), { approve: false, currentUserId });
    navigate("/dashboard/claims/refundcontribution-list");
  };

  const handleReset = () => {
    setSelectedState(initialState);
    setSelectedMember(initialMember);
    setSelectedDesignation(initialDesignation);
    setSelectedYearMaster(initialYearMaster);
    setSelectedBranch(initialBranch);
    setPresetValues({});
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedState || !selectedMember || !selectedDesignation || !selectedYearMaster || !selectedBranch) {
      throw new Error("Please select all required values");
    }
    const payload: Partial<Omit<RefundContribution, "auditLogs">> = {
      refundContributionId: Number(id),
      staffNo: selectedMember.staffNo,
      stateId: selectedState.stateId,
      memberId: selectedMember.memberId,
      designationId: selectedDesignation.designationId,
      refundNO: String(formData.refundNO || "").trim(),
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
      onOpen: () => setShowMemberPopup(true),
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => setShowDesignationPopup(true),
    },
    branchNameOFTime: {
      value: selectedBranch?.name || "",
      actualValue: selectedBranch?.name,
      onOpen: () => setShowBranchPopup(true),
    },
    yearOF: {
      value: selectedYearMaster ? String(selectedYearMaster.yearName) : "",
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
        //themeColor="#1B3763"
        themeColor={THEME_COLOR}
        attachmentConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
        onReset={handleReset}
        presetValues={presetValues}
        approvalConfig={{
          onApprove: handleApprove,
          onReject: handleReject,
          confirmApproveText: "Are you sure you want to approve this refund contribution?",
          confirmRejectText: "Are you sure you want to reject this refund contribution?",
          showWhen: (formData) => !formData.isApproved,
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
        onSelect={async (m) => {
          setSelectedMember(m);
          setShowMemberPopup(false);

          try {
            const fullMember = (await MemberService.getMemberById(m.memberId)).value;
            if (fullMember?.designationId) {
              const designation = (await DesignationService.getDesignationById(fullMember.designationId)).value;
              setSelectedDesignation(designation);
            }
            setPresetValues({ dpcodeOfTime: fullMember?.dpCode || "" });
          } catch (err) {
            console.error("Failed to auto-fill designation/DP code:", err);
          }
        }}
      />
      <DesignationPopup
        show={showDesignationPopup}
        handleClose={() => setShowDesignationPopup(false)}
        onSelect={setSelectedDesignation}
      />
      <BranchPopup
        show={showBranchPopup}
        handleClose={() => setShowBranchPopup(false)}
        onSelect={(b) => {
          setSelectedBranch(b);
          setShowBranchPopup(false);
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

export default RefundContributionEdit;