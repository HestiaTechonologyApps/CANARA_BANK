// src/Pages/Contributions/DirectPay/Edit.tsx
import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";
import type { DirectPayment } from "../../../Types/Contributions/Directpayment.types";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberPopup from "../Member/MemberPopup";

const DirectPaymentEdit: React.FC = () => {

  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "paymentDate", rules: { type: "date", label: "Payment Date", required: true, colWidth: 4 } },
    { name: "paymentMode", rules: { type: "text", label: "Payment Mode", required: true, colWidth: 4 } },
    { name: "referenceNo", rules: { type: "text", label: "Reference No", required: true, colWidth: 4 } },
    { name: "remarks", rules: { type: "textarea", label: "Remarks", colWidth: 6 } },
  ];

const handleFetch = async (id: string) => {
  const response = await DirectPaymentService.getDirectPaymentById(Number(id));
  const payment = response.value;

 if (payment) {
  setSelectedMember({
    memberId: payment.memberId,
    name: payment.memberName || "",
  } as unknown as Member);
 }

  return response;
};

 const handleUpdate = async (id: string, formData: Record<string, any>) => {
  if (!selectedMember) {
    throw new Error("Please select a member");
  }

  const payload = {
    directPaymentId: Number(id),

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
  } as Omit<DirectPayment, "auditLogs">;

  await DirectPaymentService.updateDirectPayment(Number(id), payload);
};


  const popupHandlers = {
    memberId: {
      value: selectedMember?.name ?? "",
      actualValue: selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Direct Payment"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="directPaymentId"
        navigateBackPath="/dashboard/contributions/directpayment-list"
        successMessage="Direct Payment updated successfully!"
        errorMessage="Failed to update Direct Payment"
        auditLogConfig={{
          tableName: "DirectPayment",
          recordIdField: "directPaymentId",
        }}
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
      />

      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={(member) => {
          setSelectedMember(member);
          setShowMemberPopup(false);
        }}
      />
    </>
  );
};

export default DirectPaymentEdit;
