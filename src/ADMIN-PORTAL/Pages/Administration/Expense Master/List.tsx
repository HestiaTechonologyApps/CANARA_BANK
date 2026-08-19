import React, { useCallback } from "react";
import ExpenseMasterService from "../../../Services/Administration/ExpenseMaster.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const ExpenseMasterList: React.FC = () => {
  const columns = [
    { key: "expenseMasterId", label: "ID", enableSorting: true },
    { key: "expenseTypeName", label: "Expense Type", enableSorting: true },
    { key: "expenseDate", label: "Expense Date", enableSorting: true, type: "date" as const },
    { key: "amount", label: "Amount", enableSorting: true },
    { key: "paidTo", label: "Paid To", enableSorting: false },
    { key: "paymentMode", label: "Payment Mode", enableSorting: false },
    { key: "isApproved", label: "Approved", enableSorting: true, type: "checkbox" as const },
  ];


  const paginatedFetchService = useCallback(
    async (params: {
      pageNumber: number;
      pageSize: number;
      searchTerm?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }) => {
      return ExpenseMasterService.getPaged({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        searchTerm: params.searchTerm,
        sortBy: params.sortBy,
        sortDescending: params.sortOrder === "desc",
      });
    },
    []
  );

  return (
        <KiduServerTableList
      title="Expense Master"
      subtitle="Manage administration expenses."
      columns={columns}
      idKey="expenseMasterId"
      paginatedFetchService={paginatedFetchService}
      transformData={(data) =>
        data.map((item) => ({
          ...item,
          _disableEdit: item.isApproved === true,
        }))
      }
      showAddButton
      addButtonLabel="Add New"
      addRoute="/dashboard/administration/expensemaster-create"
      editRoute="/dashboard/administration/expensemaster-edit"
      viewRoute="/dashboard/administration/expensemaster-view"
    />
  );
};

export default ExpenseMasterList;