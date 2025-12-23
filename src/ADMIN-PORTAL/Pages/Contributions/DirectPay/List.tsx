// src/components/DirectPayment/DirectPaymentList.tsx
import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";
import type { DirectPayment } from "../../../Types/Contributions/Directpayment.types";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";

const columns = [
  { key: "directPaymentId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "memberId", label: "Member ID", enableSorting: true, type: "text" as const },
  { key: "amount", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "paymentDate", label: "Payment Date", enableSorting: true, type: "text" as const },
  { key: "paymentMode", label: "Mode", enableSorting: true, type: "text" as const },
  { key: "referenceNo", label: "Reference", enableSorting: true, type: "text" as const }
];

const DirectPaymentList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }): Promise<{ data: DirectPayment[]; total: number }> => {
    const payments = await DirectPaymentService.getAllDirectPayments();

    let filtered = payments;
    if (params.searchTerm) {
      const s = params.searchTerm.toLowerCase();
      filtered = payments.filter(
        (p) =>
          p.memberId.toString().includes(s) ||
          p.referenceNo.toLowerCase().includes(s) ||
          p.paymentMode.toLowerCase().includes(s)
      );
    }

    const start = (params.pageNumber - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
      data: filtered.slice(start, end),
      total: filtered.length
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
      showAddButton={true}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      fetchData={fetchData}
      rowsPerPage={10}
    />
  );
};

export default DirectPaymentList;
