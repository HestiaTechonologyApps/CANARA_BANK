import React, { useRef, useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import type { State } from "../../../Types/Settings/States.types";
import type { Designation } from "../../../Types/Settings/Designation.types";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { MemberRefundEligibility } from "../../../Types/Claims/Refund.types";
import StatePopup from "../../Settings/State/StatePopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import MemberPopup from "../../Contributions/Member/MemberPopup";
import type { YearMaster } from "../../../Types/Settings/YearMaster.types";
import YearMasterPopup from "../../YearMaster/YearMasterPopup";
import type { AttachmentsStagingHandle } from "../../../../Components/KiduCreateAttachment";
import AttachmentsStaging from "../../../../Components/KiduCreateAttachment";
import type { Branch } from "../../../Types/Settings/Branch.types";
import BranchPopup from "../../Branch/BranchPopup";
import MemberService from "../../../Services/Contributions/Member.services";
import DesignationService from "../../../Services/Settings/Designation.services";

const RefundContributionCreate: React.FC = () => {
  const attachmentsRef = useRef<AttachmentsStagingHandle>(null);
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [presetValues, setPresetValues] = useState<Record<string, any>>({});

  // Refund eligibility for the selected member
  const [eligibility, setEligibility] = useState<MemberRefundEligibility | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  // Auto-generated refund number for the selected state
  const [nextRefundNo, setNextRefundNo] = useState<string>("");
  const [refundNoLoading, setRefundNoLoading] = useState(false);
  const [refundNoError, setRefundNoError] = useState<string | null>(null);

  // Live-tracked amount value, used to warn the user as they type (before submit)
  const [amountValue, setAmountValue] = useState<string>("");

  const loadNextRefundNo = async (stateId: number) => {
    setRefundNoLoading(true);
    setRefundNoError(null);
    try {
      const res = await RefundContributionService.getNextRefundNumber(stateId);
      if (res.isSucess) {
        setNextRefundNo(res.value);
        setPresetValues(prev => ({ ...prev, refundNO: res.value }));
      } else {
        setNextRefundNo("");
        setRefundNoError(res.error || "Unable to generate refund number for this state.");
      }
    } catch (err: any) {
      setNextRefundNo("");
      setRefundNoError(err?.message || "Unable to generate refund number for this state.");
    } finally {
      setRefundNoLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedState(null);
    setSelectedMember(null);
    setSelectedDesignation(null);
    setSelectedYearMaster(null);
    attachmentsRef.current?.clear();
    setSelectedBranch(null);
    setPresetValues({});
    setEligibility(null);
    setEligibilityError(null);
    setNextRefundNo("");
    setRefundNoError(null);
    setAmountValue("");
  };

  const loadEligibility = async (memberId: number) => {
    setEligibilityLoading(true);
    setEligibilityError(null);
    try {
      const res = await RefundContributionService.getMemberEligibility(memberId);
      if (res.isSucess) {
        setEligibility(res.value);
      } else {
        setEligibility(null);
        setEligibilityError(res.error || "Unable to fetch member's refund eligibility.");
      }
    } catch (err: any) {
      setEligibility(null);
      setEligibilityError(err?.message || "Unable to fetch member's refund eligibility.");
    } finally {
      setEligibilityLoading(false);
    }
  };

  const isAmountExceeding =
    !!eligibility && amountValue !== "" && Number(amountValue) > eligibility.availableAmount;

  const fields: Field[] = [
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4, disabled: true } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "branchNameOFTime", rules: { type: "popup", label: "Branch Name (At the Time)", required: true, colWidth: 4 } },
    { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 4 } },
    { name: "type", rules: { type: "select", label: "Type", required: true, colWidth: 4 } },
    //{ name: "ddno", rules: { type: "text", label: "DD No", required: true, colWidth: 4 } },
    //{ name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    // "lastContribution" intentionally removed from here — rendered as a read-only block below,
    // populated from the eligibility API once a member is selected.
    //{ name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },
    { name: "remark", rules: { type: "textarea", label: "Remark", colWidth: 4 } },
  ];

  //const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedState) throw new Error("Please select State");
    if (!selectedMember) throw new Error("Please select Member");
    if (!selectedDesignation) throw new Error("Please select Designation");
    //if (!selectedYearMaster) throw new Error("Please select Year");
    if (!selectedBranch) throw new Error("Please select Branch");

    const requestedAmount = Number(formData.amount);

    if (!eligibility) {
      throw new Error("Refund eligibility could not be verified for this member. Please reselect the member.");
    }
    if (requestedAmount > eligibility.availableAmount) {
      // Silent: the inline highlighted warning already tells the user this —
      // no toast/Swal popup needed for this specific case.
      const err: any = new Error(
        `Amount (${requestedAmount}) exceeds the available refund balance (${eligibility.availableAmount}) for this member.`
      );
      err.silent = true;
      throw err;
    }

    if (!nextRefundNo) {
      throw new Error("Refund number could not be generated. Please reselect the state.");
    }
    
    const currentYear = new Date().getFullYear();

    const payload = {
      staffNo: selectedMember.staffNo,
      stateId: selectedState.stateId,
      memberId: selectedMember.memberId,
      designationId: selectedDesignation.designationId,
      refundContribution: formData.type,
      refundNO: nextRefundNo,
      //refundNO: String(formData.refundNO || "").trim(),
      branchNameOFTime: selectedBranch.name,
      dpcodeOfTime: String(formData.dpcodeOfTime || "").trim(),
      type: formData.type,
      remark: String(formData.remark || "").trim(),
      ddno: "",
      dddate: null,
      dddateString: "",
      //ddno: String(formData.ddno || "").trim(),
      //dddate: toIso(formData.dddate),
      //dddateString: toIso(formData.dddate),
      amount: requestedAmount,
      lastContribution: eligibility.lastContributionAmount,
      yearOF: currentYear,
      //yearOF: selectedYearMaster.yearOf,
      deathDate: "",
      deathDateString: "",
    };

    const created = await RefundContributionService.createRefundContribution(payload as any);

    if (attachmentsRef.current?.hasFiles() && created?.refundContributionId) {
      await attachmentsRef.current.uploadAll("RefundContribution", created.refundContributionId);
    }
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
      value: selectedYearMaster ? String(selectedYearMaster.yearName) : "",
      actualValue: selectedYearMaster?.yearOf,
      onOpen: () => setShowYearMasterPopup(true),
    },
    branchNameOFTime: {
      value: selectedBranch?.name || "",
      actualValue: selectedBranch?.name,
      onOpen: () => setShowBranchPopup(true),
    },
  };

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
        errorMessage="Failed to create refund. Please try again."
        popupHandlers={popupHandlers}
        options={{ type: typeOptions }}
        navigateOnSuccess="/dashboard/claims/refundcontribution-list"
        themeColor="#1B3763"
        onReset={handleReset}
        presetValues={presetValues}
        fieldChangeHandlers={{
          amount: (value) => setAmountValue(value),
        }}
      >
        {refundNoLoading && (
          <div className="ms-1 mb-2 text-muted" style={{ fontSize: "13px" }}>
            Generating refund number…
          </div>
        )}
        {refundNoError && (
          <div className="ms-1 mb-2 text-danger" style={{ fontSize: "13px" }}>
            {refundNoError}
          </div>
        )}

        {selectedMember && (
          <div className="row mb-3 ms-1">
            {eligibilityLoading && (
              <div className="col-12 text-muted" style={{ fontSize: "13px" }}>
                Loading refund eligibility…
              </div>
            )}

            {eligibilityError && (
              <div className="col-12 text-danger" style={{ fontSize: "13px" }}>
                {eligibilityError}
              </div>
            )}

            {eligibility && !eligibilityLoading && (
              <>
                <div className="col-md-4 mb-2">
                  <label className="fw-bold">Last Contribution</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly
                    disabled
                    value={
                      eligibility.lastContributionMonth
                        ? `${eligibility.lastContributionMonth}-${eligibility.lastContributionYear} - ${eligibility.lastContributionAmount}`
                        : "No contribution found"
                    }
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="fw-bold">Total Approved Refund Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly
                    disabled
                    value={eligibility.approvedAmount}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label className="fw-bold">Total Pending/Rejected Refund Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly
                    disabled
                    value={eligibility.pendingAmount}
                  />
                </div>
                <div className="col-12">
                  <span className="fw-bold" style={{ fontSize: "13px" }}>
                    Available for refund:
                  </span>{" "}
                  <span
                    style={{ fontSize: "13px" }}
                    className={eligibility.availableAmount > 0 ? "text-success" : "text-danger"}
                  >
                    {eligibility.availableAmount}
                  </span>
                </div>
                {isAmountExceeding && (
                  <div className="col-12 mt-2">
                    <span
                      className="fw-bold d-inline-block"
                      style={{
                        fontSize: "13px",
                        color: "#b45309",
                        background: "#fffbeb",
                        border: "1px solid #fcd34d",
                        borderRadius: "6px",
                        padding: "4px 10px",
                      }}
                    >
                      ⚠ Amount ({amountValue}) exceeds the available refund balance ({eligibility.availableAmount}).
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <AttachmentsStaging ref={attachmentsRef} />
      </KiduCreate>

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(s) => {
          setSelectedState(s);
          setShowStatePopup(false);
          loadNextRefundNo(s.stateId);
        }}
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
          loadEligibility(m.memberId);
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

export default RefundContributionCreate;