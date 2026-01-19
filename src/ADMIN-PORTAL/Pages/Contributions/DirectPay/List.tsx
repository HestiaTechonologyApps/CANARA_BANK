// src/Pages/Contributions/DirectPay/List.tsx
import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";
import type { DirectPayment } from "../../../Types/Contributions/Directpayment.types";

const columns = [
  { key: "directPaymentId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "memberName", label: "Member", enableSorting: true, type: "text" as const }, // ✅
  { key: "amount", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "paymentDatestring", label: "Payment Date", enableSorting: true, type: "text" as const },
  { key: "paymentMode", label: "Mode", enableSorting: true, type: "text" as const },
  { key: "referenceNo", label: "Reference No", enableSorting: true, type: "text" as const },
];

const DirectPaymentList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: any[]; total: number }> => {

    let payments: DirectPayment[] =
      await DirectPaymentService.getAllDirectPayments();

    /* ===================== SEARCH ===================== */
    if (params.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      payments = payments.filter(p =>
        [
          p.directPaymentId?.toString(),
          p.memberName,
          p.referenceNo,
          p.paymentMode,
        ]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q))
      );
    }

    /* ===================== PAGINATION ===================== */
    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: payments.slice(start, end),
      total: payments.length,
    };
  };

  return (
    <KiduServerTable
      title="Direct Payment Management"
      subtitle="Manage direct payments"
      columns={columns}
      idKey="directPaymentId"
      addButtonLabel="Add Direct Payment"
      addRoute="/dashboard/contributions/directpayment-create"
      editRoute="/dashboard/contributions/directpayment-edit"
      viewRoute="/dashboard/contributions/directpayment-view"
      showAddButton
      showExport
      showSearch
      showActions
      showTitle
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default DirectPaymentList;
