import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";
import KiduView from "../../../Components/KiduView";

const DirectPaymentView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "directPaymentId", label: "Payment ID", icon: "bi-hash" },
    { key: "memberName", label: "Member", icon: "bi-person" },
    { key: "amount", label: "Amount", icon: "bi-currency-rupee" },
    { key: "paymentDatestring", label: "Payment Date", icon: "bi-calendar" },
    { key: "paymentMode", label: "Payment Mode", icon: "bi-wallet2" },
    { key: "referenceNo", label: "Reference No", icon: "bi-receipt" },
    { key: "remarks", label: "Remarks", icon: "bi-chat-text" },
  ];

const handleFetch = async (id: string) => {
  const response = await DirectPaymentService.getDirectPaymentById(Number(id));

  if (response.value?.paymentDatestring) {
    response.value.paymentDatestring =
      new Date(response.value.paymentDatestring).toLocaleDateString("en-IN");
  }

  return response;
};

  const handleDelete = async (id: string) => {
    await DirectPaymentService.deleteDirectPayment(Number(id));
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
        recordIdField: "directPaymentId",
      }}
      themeColor="#1B3763"
      showEditButton={true}
      showDeleteButton={true}
      deleteConfirmMessage="Are you sure you want to delete this Payment? This action cannot be undone."
    />
  );
};

export default DirectPaymentView;
