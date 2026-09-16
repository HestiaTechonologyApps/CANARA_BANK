import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Field } from "../../Components/KiduEdit";
import ExpenseMasterService from "../../Services/Administration/ExpenseMaster.services";
import AuthService from "../../../Services/Auth.services";
import KiduEdit from "../../Components/KiduEdit";

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

const ExpenseMasterApprovalEdit: React.FC = () => {
    const navigate = useNavigate();

    const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseTypeSelection | null>(null);

    const fields: Field[] = [
        { name: "expenseTypeId", rules: { type: "popup", label: "Expense Type", required: true, colWidth: 4, disabled: true } },
        { name: "expenseDate", rules: { type: "date", label: "Expense Date", required: true, colWidth: 4, disabled: true } },
        { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4, disabled: true } },
        { name: "paidTo", rules: { type: "text", label: "Paid To", required: true, colWidth: 4, disabled: true } },
        { name: "referenceNo", rules: { type: "text", label: "Reference No", colWidth: 4, disabled: true } },
        { name: "paymentMode", rules: { type: "select", label: "Payment Mode", required: true, colWidth: 4, disabled: true } },
        { name: "description", rules: { type: "textarea", label: "Description", colWidth: 12, disabled: true } },
    ];

    const options = {
        paymentMode: paymentModeOptions,
    };

    const handleFetch = async (id: string) => {
        const res = await ExpenseMasterService.getById(Number(id));
        const wrapped = { isSucess: true, value: res } as any;

        if (res) {
            setSelectedExpenseType({
                expenseTypeId: res.expenseTypeId,
                expenseTypeName: res.expenseTypeName ?? "",
            });
        }

        return wrapped;
    };

    const handleUpdate = async () => {
        throw new Error("This record is read-only. Use Approve or Reject.");
    };

    const getCurrentUserId = (): number => {
        const user = AuthService.getCurrentUser();
        if (!user?.userId) throw new Error("Unable to get current user. Please login again.");
        return user.userId;
    };

    const handleApprove = async (id: string) => {
        const currentUserId = getCurrentUserId();
        await ExpenseMasterService.approveExpenseMaster(Number(id), { approve: true, currentUserId });
        navigate("/dashboard/approval-list?tab=expenseMaster");
    };

    const handleReject = async (id: string) => {
        const currentUserId = getCurrentUserId();
        await ExpenseMasterService.approveExpenseMaster(Number(id), { approve: false, currentUserId });
        navigate("/dashboard/approval-list?tab=expenseMaster");
    };

    const popupHandlers = {
        expenseTypeId: {
            value: selectedExpenseType?.expenseTypeName ?? "",
            actualValue: selectedExpenseType?.expenseTypeId,
            onOpen: () => { },
        },
    };

    return (
        <KiduEdit
            title="Review Expense"
            fields={fields}
            options={options}
            onFetch={handleFetch}
            onUpdate={handleUpdate}
            showResetButton={false}
            popupHandlers={popupHandlers}
            paramName="expenseMasterId"
            navigateBackPath="/dashboard/approval-list?tab=expenseMaster"
            auditLogConfig={{ tableName: "EXPENSE_MASTER", recordIdField: "expenseMasterId" }}
            themeColor={THEME_COLOR}
            approvalConfig={{
                onApprove: handleApprove,
                onReject: handleReject,
                confirmApproveText: "Are you sure you want to approve this expense?",
                confirmRejectText: "Are you sure you want to reject this expense?",
                showWhen: (formData) => !formData.isApproved,
            }}
        />
    );
};

export default ExpenseMasterApprovalEdit;