import React from "react";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";
import type { DirectPayment } from "../../../Types/Contributions/Directpayment.types";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const DirectPaymentList: React.FC = () => {
  return (
    <KiduServerTableList
      fetchService={async () => {
        const payments: DirectPayment[] =
          await DirectPaymentService.getAllDirectPayments();
        return payments.map(p => ({
          ...p,
          paymentDatestring: p.paymentDatestring
            ? new Date(p.paymentDatestring).toLocaleDateString("en-IN")
            : "",
        }));
      }}

      columns={[
        { key: "directPaymentId", label: "Direct payment ID", enableSorting: true, type: "text" },
        { key: "memberName", label: "Member", enableSorting: true, type: "text" },
        { key: "amount", label: "Amount", enableSorting: true, type: "text" },
        { key: "paymentDatestring", label: "Payment Date", enableSorting: true, type: "text" },
        { key: "paymentMode", label: "Mode", enableSorting: true, type: "text" },
        { key: "referenceNo", label: "Reference No", enableSorting: true, type: "text" },
      ]}

      idKey="directPaymentId"
      title="Direct Payment Management"
      subtitle="Manage direct payments with search, filter, and pagination."
      addButtonLabel="Add Payment"
      addRoute="/dashboard/contributions/directpayment-create"
      editRoute="/dashboard/contributions/directpayment-edit"
      viewRoute="/dashboard/contributions/directpayment-view"
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      rowsPerPage={10}
    />
  );
};

export default DirectPaymentList;
