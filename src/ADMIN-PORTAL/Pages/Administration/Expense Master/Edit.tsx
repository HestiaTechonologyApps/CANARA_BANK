import React, { useState } from "react";
import KiduEdit from "../../../Components/KiduEdit";
import type { Field } from "../../../Components/KiduEdit";
import ExpenseMasterService from "../../../Services/Administration/ExpenseMaster.services";
import type { ExpenseMasterPayload } from "../../../Types/Administration/ExpenseMaster.types";
import ExpenseTypePopup from "../Expense Type/ExpenseTypePopup";
import { useParams } from "react-router-dom";
import AuthService from "../../../../Services/Auth.services";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";

const THEME_COLOR = "#1B3763";

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
  const { expenseMasterId } = useParams();
  
  const [showExpenseTypePopup, setShowExpenseTypePopup] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseTypeSelection | null>(null);
  const [initialExpenseType, setInitialExpenseType] = useState<ExpenseTypeSelection | null>(null);

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);

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
    const wrapped = { isSucess: true, value: res } as any;

    if (res) {
      const expenseType = {
        expenseTypeId: res.expenseTypeId,
        expenseTypeName: res.expenseTypeName ?? "",
      };
      setSelectedExpenseType(expenseType);
      setInitialExpenseType(expenseType);
      setIsApproved(!!res.isApproved);
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
  
  const getCurrentUserId = (): number => {
    const user = AuthService.getCurrentUser();
    if (!user?.userId) throw new Error("Unable to get current user. Please login again.");
    return user.userId;
  };

  const handleApprove = async () => {
    if (!expenseMasterId) return;

    const result = await Swal.fire({
      title: "Approve Expense?",
      text: "Are you sure you want to approve this expense?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: THEME_COLOR,
      confirmButtonText: "Yes, Approve",
    });

    if (!result.isConfirmed) return;

    setIsApproving(true);
    try {
      const currentUserId = getCurrentUserId();
      await ExpenseMasterService.approveExpenseMaster(
        Number(expenseMasterId),
        { approve: true, currentUserId }
      );
      setIsApproved(true);
      await Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Expense has been approved successfully.",
        confirmButtonColor: THEME_COLOR,
      });
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to approve expense.",
        confirmButtonColor: THEME_COLOR,
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!expenseMasterId) return;

    const result = await Swal.fire({
      title: "Reject Expense?",
      text: "Are you sure you want to reject this expense?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Yes, Reject",
    });

    if (!result.isConfirmed) return;

    setIsRejecting(true);
    try {
      const currentUserId = getCurrentUserId();
      await ExpenseMasterService.approveExpenseMaster(
        Number(expenseMasterId),
        { approve: false, currentUserId }
      );
      setIsApproved(true);
      await Swal.fire({
        icon: "success",
        title: "Rejected!",
        text: "Expense has been rejected successfully.",
        confirmButtonColor: THEME_COLOR,
      });
    } catch (err: any) {
      await Swal.fire({
         icon: "error",
        title: "Error!",
        text: err.message || "Failed to reject expense.",
        confirmButtonColor: THEME_COLOR,
      });
    } finally {
      setIsRejecting(false);
    }
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
      <div className="d-flex justify-content-end gap-2 px-3 pt-3">
        <Button
          onClick={handleApprove}
          disabled={isApproving || isRejecting || isApproved}
          style={{
            backgroundColor: isApproved ? "#6c757d" : THEME_COLOR,
            border: "none",
            cursor: isApproved ? "not-allowed" : "pointer",
          }}
        >
          {isApproving ? "Approving..." : "Approve"}
        </Button>
        <Button
          onClick={handleReject}
          disabled={isApproving || isRejecting || isApproved}
          variant={isApproved ? "secondary" : "danger"}
          style={{ cursor: isApproved ? "not-allowed" : "pointer" }}
        >
          {isRejecting ? "Rejecting..." : "Reject"}
        </Button>
      </div>

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