// src/Pages/Contributions/DirectPay/List.tsx
import React from "react";
import KiduServerTable from "../../../../Components/KiduServerTable";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";

const columns = [
  { key: "directPaymentId", label: "ID", enableSorting: true, type: "text" as const },
  { key: "memberId", label: "Member ID", enableSorting: true, type: "text" as const },
  { key: "amount", label: "Amount", enableSorting: true, type: "text" as const },
  { key: "paymentDate", label: "Payment Date", enableSorting: true, type: "text" as const },
  { key: "paymentMode", label: "Mode", enableSorting: true, type: "text" as const },
  { key: "referenceNo", label: "Reference No", enableSorting: true, type: "text" as const }
];

const DirectPaymentList: React.FC = () => {
  const fetchData = async (params: any) => {
    const data = await DirectPaymentService.getAllDirectPayments();

    const filtered = params.searchTerm
      ? data.filter(d =>
          d.memberId.toString().includes(params.searchTerm) ||
          d.referenceNo.toLowerCase().includes(params.searchTerm.toLowerCase())
        )
      : data;

    const start = (params.pageNumber - 1) * params.pageSize;
    return {
      data: filtered.slice(start, start + params.pageSize),
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
