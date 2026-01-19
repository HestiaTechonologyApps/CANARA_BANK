// src/Pages/Contributions/DirectPay/Create.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { DirectPayment } from "../../../Types/Contributions/Directpayment.types";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";
import KiduCreate from "../../../Components/KiduCreate";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberPopup from "../Member/MemberPopup";

const DirectPaymentCreate: React.FC = () => {
  
  const[showMemberPopup,setShowMemberPopup]=useState(false);
  const[selectedMember,setSelectedMember]=useState<Member|null>(null);
 
  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member ID", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "paymentDate", rules: { type: "date", label: "Payment Date", required: true, colWidth: 4 } },
    { name: "paymentMode", rules: { type: "text", label: "Payment Mode", required: true, colWidth: 4 } },
    { name: "referenceNo", rules: { type: "text", label: "Reference No", required: true, colWidth: 4 } },
    { name: "remarks", rules: { type: "textarea", label: "Remarks", colWidth: 6} }
  ];

 const handleSubmit = async (formData: Record<string, any>) => {
  if (!selectedMember) {
    throw new Error("Please select a member");
  }

  const payload = {
    memberId: selectedMember.memberId,
    amount: Number(formData.amount),
    paymentDate: formData.paymentDate,
    paymentDatestring: formData.paymentDate,
    paymentMode: formData.paymentMode.trim(),
    referenceNo: formData.referenceNo.trim(),
    remarks: formData.remarks?.trim() || "",
    createdByUserId: 0,
    createdDate: new Date().toISOString(),
    createdDatestring: new Date().toISOString(),
    isDeleted: false,
  } as Omit<DirectPayment, "directPaymentId" | "auditLogs">;

  await DirectPaymentService.createDirectPayment(payload);
};



  const popupHandlers={
    memberId:{
      value:selectedMember?.name||"",
      onOpen:()=>setShowMemberPopup(true),
    },
  }
  return (
   <>
      <KiduCreate
        title="Create Direct Payment"
        fields={fields}
        onSubmit={handleSubmit}
        successMessage="Direct Payment created successfully!"
        navigateOnSuccess="/dashboard/contributions/directpayment-list"
        themeColor="#1B3763"
         popupHandlers={popupHandlers}
      />
      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={setSelectedMember}
      />
   </>
  );
};

export default DirectPaymentCreate;
