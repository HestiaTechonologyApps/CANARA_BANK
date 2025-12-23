// src/Pages/Contributions/DirectPay/Create.tsx
import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { DirectPayment } from "../../../Types/Contributions/Directpayment.types";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";
import KiduCreate from "../../../Components/KiduCreate";


const DirectPaymentCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "memberId", rules: { type: "number", label: "Member ID", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "paymentDate", rules: { type: "date", label: "Payment Date", required: true, colWidth: 4 } },
    { name: "paymentMode", rules: { type: "text", label: "Payment Mode", required: true, colWidth: 4 } },
    { name: "referenceNo", rules: { type: "text", label: "Reference No", required: true, colWidth: 4 } },
    { name: "remarks", rules: { type: "textarea", label: "Remarks", colWidth: 12 } }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Omit<DirectPayment, "directPaymentId" | "auditLogs"> = {
      memberId: Number(formData.memberId),
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate,
      paymentDatestring: formData.paymentDate,
      paymentMode: formData.paymentMode.trim(),
      referenceNo: formData.referenceNo.trim(),
      remarks: formData.remarks || "",
      createdByUserId: 0,
      createdDate: new Date().toISOString(),
      createdDatestring: new Date().toISOString(),
      isDeleted: false
    };

    await DirectPaymentService.createDirectPayment(payload);
  };

  return (
    <KiduCreate
      title="Create Direct Payment"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Direct Payment created successfully!"
      navigateOnSuccess="/dashboard/contributions/directpayment-list"
      themeColor="#18575A"
    />
  );
};

export default DirectPaymentCreate;
