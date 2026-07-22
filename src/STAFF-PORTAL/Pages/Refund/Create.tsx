import React, { useEffect, useRef, useState } from "react";
import type { AttachmentsStagingHandle } from "../../../Components/KiduCreateAttachment";
import type { State } from "../../../ADMIN-PORTAL/Types/Settings/States.types";
import type { Member } from "../../../ADMIN-PORTAL/Types/Contributions/Member.types";
import type { Designation } from "../../../ADMIN-PORTAL/Types/Settings/Designation.types";
import type { YearMaster } from "../../../ADMIN-PORTAL/Types/Settings/YearMaster.types";
import type { Field } from "../../../ADMIN-PORTAL/Components/KiduCreate";
import RefundContributionService from "../../../ADMIN-PORTAL/Services/Claims/Refund.services";
import KiduCreate from "../../../ADMIN-PORTAL/Components/KiduCreate";
import AttachmentsStaging from "../../../Components/KiduCreateAttachment";
import StatePopup from "../../../ADMIN-PORTAL/Pages/Settings/State/StatePopup";
import YearMasterPopup from "../../../ADMIN-PORTAL/Pages/YearMaster/YearMasterPopup";
import MemberService from "../../../ADMIN-PORTAL/Services/Contributions/Member.services";
import DesignationService from "../../../ADMIN-PORTAL/Services/Settings/Designation.services";
import BranchService from "../../../ADMIN-PORTAL/Services/Settings/Branch.services";

const MemberRefundContributionCreate: React.FC = () => {
  const attachmentsRef = useRef<AttachmentsStagingHandle>(null);
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showYearMasterPopup, setShowYearMasterPopup] = useState(false);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

  const [presetValues, setPresetValues] = useState<Record<string, any>>({});

  // Auto-fill Member (from session), Designation and DP Code (from member's own record)
  useEffect(() => {
    const loadOwnDetails = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      setSelectedMember({
        memberId: user.memberId,
        name: user.userName,
      } as Member);

      const memberRes = await MemberService.getMemberById(Number(user.memberId));
      const member = memberRes.value;
      if (!member) return;

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
    };

    loadOwnDetails();
  }, []);

  const handleReset = () => {
    setSelectedState(null);
    setSelectedYearMaster(null);
    attachmentsRef.current?.clear();
  };

  const fields: Field[] = [
    { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4 } },
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4, disabled: true } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4 } },
    { name: "branchNameOFTime", rules: { type: "text", label: "Branch Name (At the Time)", required: true, colWidth: 4 } },
    { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 4, disabled: true } },
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

//   await RefundContributionService.createRefundContribution(
//     payload as any
//   );
// };
const created = await RefundContributionService.createRefundContribution(
    payload as any
  );

  if (attachmentsRef.current?.hasFiles() && created?.refundContributionId) {
    await attachmentsRef.current.uploadAll(
      "RefundContribution",           // tableName — match your backend's expected value
      created.refundContributionId
    );
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
    onOpen: () => {}, // no-op, field is disabled
  },
  designationId: {
    value: selectedDesignation?.name || "",
    actualValue: selectedDesignation?.designationId,
    onOpen: () => {}, // no-op, field is disabled
  },
  yearOF: {
    value: selectedYearMaster
      ? String(selectedYearMaster.yearName) 
      : "",
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
           <AttachmentsStaging ref={attachmentsRef} />
        </KiduCreate>
      </div>

      <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={(s) => {
          setSelectedState(s);
          setShowStatePopup(false);
        }} />
     <YearMasterPopup
       show={showYearMasterPopup}
       handleClose={() => setShowYearMasterPopup(false)}
       onSelect={(y) => {
        setSelectedYearMaster(y);
        setShowYearMasterPopup(false);
     }} />
    </>
  );
};

export default MemberRefundContributionCreate;
