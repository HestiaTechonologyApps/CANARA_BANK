import React, { useRef, useState } from "react";
import KiduCreate from "../../../Components/KiduCreate";
import type { Field } from "../../../Components/KiduCreate";
import type { ExpenseType } from "../../../Types/Administration/ExpenseType.types";
import type { ExpenseMasterPayload } from "../../../Types/Administration/ExpenseMaster.types";
import ExpenseMasterService from "../../../Services/Administration/ExpenseMaster.services";
import ExpenseTypePopup from "../Expense Type/ExpenseTypePopup";
import type { AttachmentsStagingHandle } from "../../../../Components/KiduCreateAttachment";
import AttachmentsStaging from "../../../../Components/KiduCreateAttachment";


const paymentModeOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Cheque", label: "Cheque" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "UPI", label: "UPI" },
];

const ExpenseMasterCreate: React.FC = () => {
    const attachmentsRef = useRef<AttachmentsStagingHandle>(null);
  const [showExpenseTypePopup, setShowExpenseTypePopup] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseType | null>(null);

  const handleReset = () => {
    setSelectedExpenseType(null);
    attachmentsRef.current?.clear();
  };

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

  const popupHandlers = {
    expenseTypeId: {
      value: selectedExpenseType?.name ?? "",
      actualValue: selectedExpenseType?.expenseTypeId,
      onOpen: () => setShowExpenseTypePopup(true),
    },
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedExpenseType) {
      throw new Error("Please select an Expense Type");
    }

    const payload: ExpenseMasterPayload = {
      expenseMasterId: 0,
      expenseTypeId: selectedExpenseType.expenseTypeId,
      expenseDate: formData.expenseDate,
      amount: Number(formData.amount),
      paidTo: formData.paidTo.trim(),
      referenceNo: formData.referenceNo?.trim() || "",
      paymentMode: formData.paymentMode,
      description: formData.description?.trim() || "",
      isDeleted: false,
    };

    const created = await ExpenseMasterService.create(payload);

    // Record now has a real ID — send any staged attachments,
    // same flow as AccountDirectEntryCreate.handleSubmit
    if (attachmentsRef.current?.hasFiles() && created?.expenseMasterId) {
      await attachmentsRef.current.uploadAll(
        "ExpenseMaster",
        created.expenseMasterId
      );
    }
  };

  return (
    <>
      <KiduCreate
        title="Create Expense"
        fields={fields}
        options={options}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        submitButtonText="Create Expense"
        showResetButton
        successMessage="Expense created successfully!"
        errorMessage="Failed to create expense. Please try again."
        navigateOnSuccess="/dashboard/administration/expensemaster-list"
        themeColor="#1B3763"
        onReset={handleReset}
      >
        <AttachmentsStaging ref={attachmentsRef} />
      </KiduCreate>

      <ExpenseTypePopup
        show={showExpenseTypePopup}
        handleClose={() => setShowExpenseTypePopup(false)}
        onSelect={(et) => {
          setSelectedExpenseType(et);
          setShowExpenseTypePopup(false);
        }}
      />
    </>
  );
};

export default ExpenseMasterCreate;