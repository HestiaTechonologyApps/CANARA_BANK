// src/Pages/Contributions/DirectPay/Edit.tsx
import React from "react";
import type { Field } from "../../../Components/KiduCreate";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";
import type { DirectPayment } from "../../../Types/Contributions/Directpayment.types";
import KiduEdit from "../../../Components/KiduEdit";


const DirectPaymentEdit: React.FC = () => {
  const fields: Field[] = [
    { name: "memberId", rules: { type: "number", label: "Member ID", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "paymentDate", rules: { type: "date", label: "Payment Date", required: true, colWidth: 4 } },
    { name: "paymentMode", rules: { type: "text", label: "Payment Mode", required: true, colWidth: 4 } },
    { name: "referenceNo", rules: { type: "text", label: "Reference No", required: true, colWidth: 4 } },
    { name: "remarks", rules: { type: "textarea", label: "Remarks", colWidth: 12 } }
  ];

  const handleFetch = async (id: string) => {
    return await DirectPaymentService.getDirectPaymentById(Number(id));
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: Partial<DirectPayment> = {
      memberId: Number(formData.memberId),
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate,
      paymentDatestring: formData.paymentDate,
      paymentMode: formData.paymentMode.trim(),
      referenceNo: formData.referenceNo.trim(),
      remarks: formData.remarks || ""
    };

    await DirectPaymentService.updateDirectPayment(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Direct Payment"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      paramName="directPaymentId"
      navigateBackPath="/dashboard/contributions/directpayment-list"
      successMessage="Direct Payment updated successfully!"
      auditLogConfig={{ tableName: "DirectPayment", recordIdField: "directPaymentId" }}
      themeColor="#18575A"
    />
  );
};

export default DirectPaymentEdit;
