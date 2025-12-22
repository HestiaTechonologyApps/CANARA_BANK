// src/components/DirectPayment/DirectPaymentView.tsx
import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import KiduView from "../../../Components/KiduView";
import DirectPaymentService from "../../../Services/Contributions/Directpay.services";

const DirectPaymentView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "directPaymentId", label: "Payment ID", icon: "bi-hash" },
    { key: "memberId", label: "Member ID", icon: "bi-person" },
    { key: "amount", label: "Amount", icon: "bi-currency-rupee" },
    { key: "paymentDate", label: "Payment Date", icon: "bi-calendar-event" },
    { key: "paymentMode", label: "Payment Mode", icon: "bi-wallet2" },
    { key: "referenceNo", label: "Reference No", icon: "bi-receipt" },
    { key: "remarks", label: "Remarks", icon: "bi-chat-text" }
  ];

  const handleFetch = async (directPaymentId: string) => {
    return await DirectPaymentService.getDirectPaymentById(Number(directPaymentId));
  };

  const handleDelete = async (directPaymentId: string) => {
    await DirectPaymentService.deleteDirectPayment(Number(directPaymentId));
  };

  return (
    <KiduView
      title="Direct Payment Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      paramName="directPaymentId"
      listRoute="/dashboard/contributions/directpayment-list"
      editRoute="/dashboard/contributions/directpayment-edit"
      auditLogConfig={{
        tableName: "DirectPayment",
        recordIdField: "directPaymentId"
      }}
      themeColor="#18575A"
      showEditButton
      showDeleteButton
    />
  );
};

export default DirectPaymentView;
