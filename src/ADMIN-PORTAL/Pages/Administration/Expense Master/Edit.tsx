import React, { useState } from "react";
import KiduEdit from "../../../Components/KiduEdit";
import type { Field } from "../../../Components/KiduEdit";
import ExpenseMasterService from "../../../Services/Administration/ExpenseMaster.services";
import type { ExpenseMasterPayload } from "../../../Types/Administration/ExpenseMaster.types";
import ExpenseTypePopup from "../Expense Type/ExpenseTypePopup";


type ExpenseTypeSelection = {
  expenseTypeId: number;
  expenseTypeName: string;
};

const paymentModeOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Cheque", label: "Cheque" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "UPI", label: "UPI" },
];

const ExpenseMasterEdit: React.FC = () => {
  const [showExpenseTypePopup, setShowExpenseTypePopup] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseTypeSelection | null>(null);
  const [initialExpenseType, setInitialExpenseType] = useState<ExpenseTypeSelection | null>(null);

  const fields: Field[] = [
    { name: "expenseTypeId", rules: { type: "popup", label: "Expense Type", required: true, colWidth: 4 } },
    { name: "expenseDate", rules: { type: "date", label: "Expense Date", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "paidTo", rules: { type: "text", label: "Paid To", required: true, colWidth: 4 } },
    { name: "referenceNo", rules: { type: "text", label: "Reference No", colWidth: 4 } },
    { name: "paymentMode", rules: { type: "select", label: "Payment Mode", required: true, colWidth: 4 } },
    { name: "description", rules: { type: "textarea", label: "Description", colWidth: 12 } },
  ];

  const options = {
    paymentMode: paymentModeOptions,
  };

  const handleFetch = async (id: string) => {
    const res = await ExpenseMasterService.getById(Number(id));
    // KiduEdit expects a CustomResponse-shaped object with isSucess/value —
    // getById already unwraps to the raw ExpenseMaster, so re-wrap it here.
    const wrapped = { isSucess: true, value: res } as any;

    if (res) {
      const expenseType = {
        expenseTypeId: res.expenseTypeId,
        expenseTypeName: res.expenseTypeName ?? "",
      };
      setSelectedExpenseType(expenseType);
      setInitialExpenseType(expenseType);
    }

    return wrapped;
  };

  const handleReset = () => {
    setSelectedExpenseType(initialExpenseType);
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedExpenseType) {
      throw new Error("Please select an Expense Type");
    }

    const payload: ExpenseMasterPayload = {
      expenseMasterId: Number(id),
      expenseTypeId: selectedExpenseType.expenseTypeId,
      expenseDate: formData.expenseDate,
      amount: Number(formData.amount),
      paidTo: formData.paidTo.trim(),
      referenceNo: formData.referenceNo?.trim() || "",
      paymentMode: formData.paymentMode,
      description: formData.description?.trim() || "",
      isDeleted: false,
    };

    await ExpenseMasterService.update(Number(id), payload);
  };

  const popupHandlers = {
    expenseTypeId: {
      value: selectedExpenseType?.expenseTypeName ?? "",
      actualValue: selectedExpenseType?.expenseTypeId,
      onOpen: () => setShowExpenseTypePopup(true),
    },
  };

  return (
    <>
      <KiduEdit
        title="Edit Expense"
        fields={fields}
        options={options}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        submitButtonText="Update Expense"
        showResetButton
        successMessage="Expense updated successfully!"
        errorMessage="Failed to update expense."
        loadingText="Loading expense details..."
        paramName="expenseMasterId"
        navigateBackPath="/dashboard/administration/expensemaster-list"
        auditLogConfig={{ tableName: "EXPENSE_MASTER", recordIdField: "expenseMasterId" }}
        attachmentConfig={{ tableName: "ExpenseMaster", recordIdField: "expenseMasterId" }}
        themeColor="#1B3763"
        onReset={handleReset}
      />

      <ExpenseTypePopup
        show={showExpenseTypePopup}
        handleClose={() => setShowExpenseTypePopup(false)}
        onSelect={(v) => {
          setSelectedExpenseType({
            expenseTypeId: v.expenseTypeId,
            expenseTypeName: v.name,
          });
          setShowExpenseTypePopup(false);
        }}
      />
    </>
  );
};

export default ExpenseMasterEdit;