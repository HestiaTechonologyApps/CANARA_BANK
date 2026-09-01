import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Member } from "../../Types/Contributions/Member.types";
import type { Field } from "../../Components/KiduEdit";
import DirectPaymentService from "../../Services/Contributions/Directpayment.services";
import AuthService from "../../../Services/Auth.services";
import KiduEdit from "../../Components/KiduEdit";

const DirectPaymentApprovalEdit: React.FC = () => {
  const navigate = useNavigate();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4, disabled: true } },
    { name: "paymentDate", rules: { type: "date", label: "Payment Date", required: true, colWidth: 4, disabled: true } },
    { name: "paymentMode", rules: { type: "select", label: "Payment Mode", required: true, colWidth: 4, disabled: true } },
    { name: "referenceNo", rules: { type: "text", label: "Reference No", required: true, colWidth: 4, disabled: true } },
    { name: "remarks", rules: { type: "textarea", label: "Remarks", colWidth: 6, disabled: true } },
  ];

  const handleFetch = async (id: string) => {
    const response = await DirectPaymentService.getDirectPaymentById(Number(id));
    const payment = response.value;

    if (payment) {
      setSelectedMember({
        memberId: payment.memberId,
        name: payment.memberName || "",
      } as unknown as Member);
    }

    return {
      ...response,
      value: {
        ...payment,
        paymentDate: payment.paymentDate ? String(payment.paymentDate).split("T")[0] : "",
      },
    };
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
    await DirectPaymentService.approveDirectPayment(Number(id), { approve: true, currentUserId });
    navigate("/dashboard/contributions/directpayment-list?tab=directPayment");
  };

  const handleReject = async (id: string) => {
    const currentUserId = getCurrentUserId();
    await DirectPaymentService.approveDirectPayment(Number(id), { approve: false, currentUserId });
    navigate("/dashboard/contributions/directpayment-list?tab=directPayment");
  };

  const popupHandlers = {
    memberId: {
      value: selectedMember?.name ?? "",
      actualValue: selectedMember?.memberId,
      onOpen: () => {},
    },
  };

  const paymentModeOptions = [
    { value: "Cash Payment", label: "Cash Payments" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Cheque", label: "Cheque" },
    { value: "Card Payment", label: "Card Payment" },
    { value: "Digital/ Wallet Payment", label: "Digital/ Wallet Payment" },
    { value: "Recurring Payment", label: "Recurring Payment" },
    { value: "International Payment", label: "International Payment" },
    { value: "Bank Specific", label: "Bank Specific" },
    { value: "Government/ Statutory Payment", label: "Government/ Statutory Payment" },
  ];

  return (
    <KiduEdit
      title="Review Direct Payment"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      showResetButton={false}
      paramName="directPaymentId"
      navigateBackPath="/dashboard/contributions/directpayment-list?tab=directPayment"
      auditLogConfig={{ tableName: "DirectPayment", recordIdField: "directPaymentId" }}
      themeColor="#1B3763"
      popupHandlers={popupHandlers}
      options={{ paymentMode: paymentModeOptions }}
      approvalConfig={{
        onApprove: handleApprove,
        onReject: handleReject,
        confirmApproveText: "Are you sure you want to approve this payment?",
        confirmRejectText: "Are you sure you want to reject this payment?",
        showWhen: (formData) => !formData.isApproved,
      }}
    />
  );
};

export default DirectPaymentApprovalEdit;