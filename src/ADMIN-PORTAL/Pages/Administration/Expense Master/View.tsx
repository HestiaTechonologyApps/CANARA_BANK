import React from "react";
import KiduView from "../../../Components/KiduView";
import type { ViewField } from "../../../Components/KiduView";
import ExpenseMasterService from "../../../Services/Administration/ExpenseMaster.services";

const ExpenseMasterView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "expenseTypeName", label: "Expense Type" },
    { key: "expenseDate", label: "Expense Date", isDate: true },
    { key: "amount", label: "Amount", formatter: (value) => `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,},
    { key: "paidTo", label: "Paid To" },
    { key: "referenceNo", label: "Reference No" },
    { key: "paymentMode", label: "Payment Mode" },
    { key: "description", label: "Description" },
    { key: "isApproved", label: "Approval Status", formatter: (value) => (value ? "Approved" : "Pending"),},
  ];

  const handleFetch = async (id: string) => {
    const res = await ExpenseMasterService.getById(Number(id));
    return { isSucess: true, value: res } as any;
  };

  const handleDelete = async (id: string) => {
    await ExpenseMasterService.delete(Number(id));
  };

  return (
        <KiduView
      title="Expense Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/administration/expensemaster-edit"
      listRoute="/dashboard/administration/expensemaster-list"
      paramName="expenseMasterId"
      attachmentConfig={{ tableName: "ExpenseMaster", recordIdField: "expenseMasterId" }}
      auditLogConfig={{ tableName: "EXPENSE_MASTER", recordIdField: "expenseMasterId" }}
      themeColor="#1B3763"
      deleteConfirmMessage="Are you sure you want to delete this expense record?"
      disableEditWhen={(data) => data.isApproved === true || data.status === "Approved"}
      disableDeleteWhen={(data) => data.isApproved === true || data.status === "Approved"}
    />
  );
};

export default ExpenseMasterView;