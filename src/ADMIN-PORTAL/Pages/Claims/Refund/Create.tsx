// src/ADMIN-PORTAL/Pages/Contributions/RefundContribution/RefundContributionCreate.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import KiduCreate from "../../../Components/KiduCreate";
import type { RefundContribution } from "../../../Types/Claims/Refund.types";
import RefundContributionService from "../../../Services/Claims/Refund.services";
import type { State } from "../../../Types/Settings/States.types";
import StatePopup from "../../Settings/State/StatePopup";
import type { Designation } from "../../../Types/Settings/Designation";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";


const RefundContributionCreate: React.FC = () => {
   //const [isLoading, setIsLoading] = useState(false);
    const [showStatePopup, setShowStatePopup] = useState(false);
    const[showDesignationPopup,setShowDesignationPopup]=useState(false);
    
    const [selectedState, setSelectedState] = useState<State | null>(null);
    const[selectedDesignation,setSelectedDesignation]=useState<Designation|null>(null);
 
    const fields: Field[] = [
   // { name: "staffNo", rules: { type: "number", label: "Staff No", required: true, colWidth: 4 } },
    { name: "stateId", rules: { type: "popup", label: "State ID", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation ID", required: true, colWidth: 4 } },
    { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4 } },
    { name: "branchNameOFTime", rules: { type: "text", label: "Branch Name (At the Time)", required: true, colWidth: 4 } },
    { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 4 } },
    { name: "type", rules: { type: "text", label: "Type", required: true, colWidth: 4 } },
    { name: "remark", rules: { type: "textarea", label: "Remark", required: false, colWidth: 12 } },
    { name: "ddno", rules: { type: "text", label: "DD No", required: true, colWidth: 4 } },
    { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "lastContribution", rules: { type: "number", label: "Last Contribution", required: false, colWidth: 4 } },
    { name: "yearOF", rules: { type: "number", label: "Year Of", required: true, colWidth: 4 } },
  ];

//const toIso = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleSubmit = async (formData: Record<string, any>) => {
   
    try{
      const payload: Omit<RefundContribution, "refundContributionId" | "auditLogs"> = {
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
    await RefundContributionService.createRefundContribution(payload);
    } catch(err){
      console.error("Error creating Refund Contribution:", err);
      throw err;
    } 
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
      <KiduCreate
        title="Create Refund Contribution"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Refund Contribution"
        showResetButton
        successMessage="Refund Contribution created successfully!"
        errorMessage="Failed to create Refund Contribution. Please try again."
        navigateOnSuccess="/dashboard/claims/refundcontribution-list"
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

export default RefundContributionCreate;
