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


const RefundContributionEdit: React.FC = () => {

     const [showStatePopup, setShowStatePopup] = useState(false);
       const[showDesignationPopup,setShowDesignationPopup]=useState(false);
       
       const [selectedState, setSelectedState] = useState<State | null>(null);
       const[selectedDesignation,setSelectedDesignation]=useState<Designation|null>(null);
     
  const fields: Field[] = [
    { name: "refundContributionId", rules: { type: "number", label: "Refund Contribution ID", required: false, disabled: true, colWidth: 3 } },
   // { name: "staffNo", rules: { type: "number", label: "Staff No", required: true, colWidth: 3 } },
    { name: "stateId", rules: { type: "popup", label: "State ID", required: true, colWidth: 3 } },
    { name: "designationId", rules: { type: "popup", label: "Designation ID", required: true, colWidth: 3 } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 3 } },
    { name: "branchNameOFTime", rules: { type: "text", label: "Branch Name (At the Time)", required: true, colWidth: 3 } },
    { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 3 } },
    { name: "type", rules: { type: "text", label: "Type", required: true, colWidth: 3 } },
    { name: "remark", rules: { type: "textarea", label: "Remark", required: false, colWidth: 12 } },
    { name: "ddno", rules: { type: "text", label: "DD No", required: true, colWidth: 3 } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 3 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 3 } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", required: false, colWidth: 3 } },
    { name: "yearOF", rules: { type: "number", label: "Year Of", required: true, colWidth: 3 } },
  ];

  const handleFetch = async (id: string) => {
    const response = await RefundContributionService.getRefundContributionById(Number(id));
    return response;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Omit<RefundContribution, "auditLogs"> = {
      refundContributionId: Number(id),
      staffNo: Number(formData.staffNo),
      stateId: Number(formData.stateId),
      designationId: Number(formData.designationId),
      deathDate: "",
      deathDateString: "",
      refundNO: formData.refundNO?.trim() || "",
      branchNameOFTime: formData.branchNameOFTime?.trim() || "",
      dpcodeOfTime: formData.dpcodeOfTime?.trim() || "",
      type: formData.type?.trim() || "",
      remark: formData.remark?.trim() || "",
      ddno: formData.ddno?.trim() || "",
      dddate: formData.dddate,
      dddateString: formData.dddate,
      amount: Number(formData.amount),
      lastContribution: Number(formData.lastContribution || 0),
      yearOF: Number(formData.yearOF),
    };
    await RefundContributionService.updateRefundContribution(Number(id), payload);
  };

   const popupHandlers = {
  stateId: {
    value: selectedState?.stateId?.toString() || "",
    onOpen: () => setShowStatePopup(true),
  },
  designationId: {
    value: selectedDesignation?.designationId?.toString() || "",
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
      />
   <StatePopup
        show={showStatePopup}
        handleClose={() => setShowStatePopup(false)}
        onSelect={setSelectedState}
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
