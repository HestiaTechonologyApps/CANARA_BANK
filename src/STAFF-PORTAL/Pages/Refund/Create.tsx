import React, { useEffect, useRef, useState } from "react";
import type { AttachmentsStagingHandle } from "../../../Components/KiduCreateAttachment";
import type { State } from "../../../ADMIN-PORTAL/Types/Settings/States.types";
import type { Member } from "../../../ADMIN-PORTAL/Types/Contributions/Member.types";
import type { Designation } from "../../../ADMIN-PORTAL/Types/Settings/Designation.types";
import type { YearMaster } from "../../../ADMIN-PORTAL/Types/Settings/YearMaster.types";
import type { Field } from "../../../ADMIN-PORTAL/Components/KiduCreate";
import type { MemberRefundEligibility } from "../../../ADMIN-PORTAL/Types/Claims/Refund.types";
import RefundContributionService from "../../../ADMIN-PORTAL/Services/Claims/Refund.services";
import KiduCreate from "../../../ADMIN-PORTAL/Components/KiduCreate";
import AttachmentsStaging from "../../../Components/KiduCreateAttachment";
import StatePopup from "../../../ADMIN-PORTAL/Pages/Settings/State/StatePopup";
import YearMasterPopup from "../../../ADMIN-PORTAL/Pages/YearMaster/YearMasterPopup";
import MemberService from "../../../ADMIN-PORTAL/Services/Contributions/Member.services";
import DesignationService from "../../../ADMIN-PORTAL/Services/Settings/Designation.services";
import BranchService from "../../../ADMIN-PORTAL/Services/Settings/Branch.services";
import type { Branch } from "../../../ADMIN-PORTAL/Types/Settings/Branch.types";
import BranchPopup from "../../../ADMIN-PORTAL/Pages/Branch/BranchPopup";

const MemberRefundContributionCreate: React.FC = () => {
  const attachmentsRef = useRef<AttachmentsStagingHandle>(null);
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const [presetValues, setPresetValues] = useState<Record<string, any>>({});

  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Refund eligibility for the logged-in member
  const [eligibility, setEligibility] = useState<MemberRefundEligibility | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  const loadEligibility = async (memberId: number) => {
    setEligibilityLoading(true);
    setEligibilityError(null);
    try {
      const res = await RefundContributionService.getMemberEligibility(memberId);
      if (res.isSucess) {
        setEligibility(res.value);
      } else {
        setEligibility(null);
        setEligibilityError(res.error || "Unable to fetch your refund eligibility.");
      }
    } catch (err: any) {
      setEligibility(null);
      setEligibilityError(err?.message || "Unable to fetch your refund eligibility.");
    } finally {
      setEligibilityLoading(false);
    }
  };

  // Auto-fill Member (from session), Designation and DP Code (from member's own record)
  useEffect(() => {
    const loadOwnDetails = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      const memberRes = await MemberService.getMemberById(Number(user.memberId));
      const member = memberRes.value;
      if (!member) return;

      setSelectedMember(member);

      if (member.designationId) {
        const designation = (await DesignationService.getDesignationById(member.designationId)).value;
        setSelectedDesignation(designation);
      }

      let dpCode = "";
      if (member.branchId) {
        const branchRes = await BranchService.getBranchById(member.branchId);
        const branch = branchRes?.value as any;
        dpCode = branch?.dpCode || branch?.dpcode || "";
      }

      setPresetValues({ dpcodeOfTime: dpCode });

      loadEligibility(member.memberId);
    };

    loadOwnDetails();
  }, []);

  const handleReset = () => {
    setSelectedState(null);
    setSelectedYearMaster(null);
    attachmentsRef.current?.clear();
    setSelectedBranch(null);
  };

  const fields: Field[] = [
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4 } },
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4, disabled: true } },
    { name: "branchNameOFTime", rules: { type: "popup", label: "Branch Name (At the Time)", required: true, colWidth: 4 } },
    { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 4, disabled: true } },
    { name: "type", rules: { type: "select", label: "Type", required: true, colWidth: 4 } },
    { name: "ddno", rules: { type: "text", label: "DD No", required: true, colWidth: 4 } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    // "lastContribution" intentionally removed from here — rendered as a read-only block below,
    // populated from the eligibility API on load.
    { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 4 } },
    { name: "remark", rules: { type: "textarea", label: "Remark", colWidth: 4 } },
  ];

  const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedState) throw new Error("Please select State");
    if (!selectedMember) throw new Error("Please select Member");
    if (!selectedDesignation) throw new Error("Please select Designation");
    if (!selectedYearMaster) throw new Error("Please select Year");
    if (!selectedBranch) throw new Error("Please select Branch");

    const requestedAmount = Number(formData.amount);

    if (!eligibility) {
      throw new Error("Your refund eligibility could not be verified. Please reload the page.");
    }
    if (requestedAmount > eligibility.availableAmount) {
      throw new Error(
        `Amount (${requestedAmount}) exceeds your available refund balance (${eligibility.availableAmount}).`
      );
    }

    const payload = {
      staffNo: selectedMember.staffNo,
      stateId: selectedState.stateId,
      memberId: selectedMember.memberId,
      designationId: selectedDesignation.designationId,
      refundContribution: formData.type,
      refundNO: String(formData.refundNO || "").trim(),
      //branchNameOFTime: String(formData.branchNameOFTime || "").trim(),
      branchNameOFTime: selectedBranch.name,
      dpcodeOfTime: String(formData.dpcodeOfTime || "").trim(),
      type: formData.type,
      remark: String(formData.remark || "").trim(),
      ddno: String(formData.ddno || "").trim(),
      dddate: toIso(formData.dddate),
      dddateString: toIso(formData.dddate),
      amount: requestedAmount,
      lastContribution: eligibility.lastContributionAmount,
      yearOF: selectedYearMaster.yearOf,
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
      onOpen: () => {},
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => {}, // no-op, field is disabled
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

  const typeOptions = [
    { value: "Refund", label: "Refund" },
    { value: "Loan", label: "Loan" },
    { value: "Emergency", label: "Emergency" },
  ];

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
          navigateOnSuccess="/staff-portal/refund-list"
          themeColor="#1B3763"
          onReset={handleReset}
          presetValues={presetValues}
        >
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
                </>
              )}
            </div>
          )}

          <AttachmentsStaging ref={attachmentsRef} />
        </KiduCreate>
      </div>

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(s) => {
          setSelectedState(s);
          setShowStatePopup(false);
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

export default MemberRefundContributionCreate;