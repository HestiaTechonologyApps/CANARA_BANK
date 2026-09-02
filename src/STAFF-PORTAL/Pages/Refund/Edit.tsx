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
import type { RefundContribution, MemberRefundEligibility } from "../../../ADMIN-PORTAL/Types/Claims/Refund.types";
import KiduEdit from "../../../ADMIN-PORTAL/Components/KiduEdit";
import StatePopup from "../../../ADMIN-PORTAL/Pages/Settings/State/StatePopup";
import YearMasterPopup from "../../../ADMIN-PORTAL/Pages/YearMaster/YearMasterPopup";
import type { Branch } from "../../../ADMIN-PORTAL/Types/Settings/Branch.types";
import BranchPopup from "../../../ADMIN-PORTAL/Pages/Branch/BranchPopup";

const MemberRefundContributionEdit: React.FC = () => {
  const [showStatePopup, setShowStatePopup] = useState(false);
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

  const [currentRefundId, setCurrentRefundId] = useState<number | null>(null);

  // Refund eligibility for the member
  const [eligibility, setEligibility] = useState<MemberRefundEligibility | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  // Auto-generated refund number — only regenerated when the user picks a (new)
  // state via the popup, never on the initial fetch of the existing record.
  const [presetValues, setPresetValues] = useState<Record<string, any>>({});
  const [refundNoLoading, setRefundNoLoading] = useState(false);
  const [refundNoError, setRefundNoError] = useState<string | null>(null);

  // Live-tracked amount value, used to warn the user as they type (before submit)
  const [amountValue, setAmountValue] = useState<string>("");
  const [currentAmountAtFetch, setCurrentAmountAtFetch] = useState<string>("");

  const regenerateRefundNo = async (stateId: number) => {
    setRefundNoLoading(true);
    setRefundNoError(null);
    try {
      const res = await RefundContributionService.getNextRefundNumber(stateId);
      if (res.isSucess) {
        setPresetValues(prev => ({ ...prev, refundNO: res.value }));
      } else {
        setRefundNoError(res.error || "Unable to generate refund number for this state.");
      }
    } catch (err: any) {
      setRefundNoError(err?.message || "Unable to generate refund number for this state.");
    } finally {
      setRefundNoLoading(false);
    }
  };

  const loadEligibility = async (memberId: number, excludeId?: number) => {
    setEligibilityLoading(true);
    setEligibilityError(null);
    try {
      const res = await RefundContributionService.getMemberEligibility(memberId, excludeId);
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

  const isAmountExceeding =
    !!eligibility && amountValue !== "" && Number(amountValue) > eligibility.availableAmount;

  const fields: Field[] = [
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4, disabled: true } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4, disabled: true } },
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

    setCurrentRefundId(Number(id));
    const fetchedAmount = refund.amount != null ? String(refund.amount) : "";
    setAmountValue(fetchedAmount);
    setCurrentAmountAtFetch(fetchedAmount);

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
      if (member?.memberId) {
        loadEligibility(member.memberId, Number(id));
      }
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
    setPresetValues({});
    setRefundNoError(null);
    setAmountValue(currentAmountAtFetch);
    if (initialMember?.memberId) {
      loadEligibility(initialMember.memberId, currentRefundId ?? undefined);
    }
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedState || !selectedMember || !selectedDesignation || !selectedYearMaster || !selectedBranch) {
      throw new Error("Please select all required values");
    }

    const requestedAmount = Number(formData.amount);

    if (eligibility && requestedAmount > eligibility.availableAmount) {
      // Silent: the inline highlighted warning already tells the user this —
      // no toast/Swal popup needed for this specific case.
      const err: any = new Error(
        `Amount (${requestedAmount}) exceeds your available refund balance (${eligibility.availableAmount}).`
      );
      err.silent = true;
      throw err;
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
      amount: requestedAmount,
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
      onOpen: () => { },
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => { },
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
          presetValues={presetValues}
          fieldChangeHandlers={{
            amount: (value) => setAmountValue(value),
          }}
        >
          {refundNoLoading && (
            <div className="ms-1 mb-2 text-muted" style={{ fontSize: "13px" }}>
              Generating new refund number…
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
                        ⚠ Amount ({amountValue}) exceeds your available refund balance ({eligibility.availableAmount}).
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </KiduEdit>
      </div>

      {/* <StatePopup show={showStatePopup} handleClose={() => setShowStatePopup(false)} onSelect={setSelectedState} /> */}
      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(s) => {
          setSelectedState(s);
          setShowStatePopup(false);
          regenerateRefundNo(s.stateId);
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

export default MemberRefundContributionEdit;