import React, { useState } from "react";
//import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
//import Swal from "sweetalert2";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import DirectPaymentService from "../../../Services/Contributions/Directpayment.services";
import type { DirectPayment } from "../../../Types/Contributions/Directpayment.types";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberPopup from "../Member/MemberPopup";
import AuthService from "../../../../Services/Auth.services";

//const THEME_COLOR = "#1B3763";

const DirectPaymentEdit: React.FC = () => {
  const navigate = useNavigate();
 // const { directPaymentId } = useParams();

  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [initialMember, setInitialMember] = useState<Member | null>(null);

  const fields: Field[] = [
    { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4 } },
    { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4 } },
    { name: "paymentDate", rules: { type: "date", label: "Payment Date", required: true, colWidth: 4 ,min: new Date().toISOString().split("T")[0],} },
    { name: "paymentMode", rules: { type: "select", label: "Payment Mode", required: true, colWidth: 4 } },
    { name: "referenceNo", rules: { type: "text", label: "Reference No", required: true, colWidth: 4 } },
    { name: "remarks", rules: { type: "textarea", label: "Remarks", colWidth: 6 } },
  ];

const handleFetch = async (id: string) => {
  const response = await DirectPaymentService.getDirectPaymentById(Number(id));
  const payment = response.value;

  if (payment) {
    const member = {
      memberId: payment.memberId,
      name: payment.memberName || "",
    } as unknown as Member;

    setSelectedMember(member);
    setInitialMember(member);
  }

  return {
    ...response,
    value: {
      ...payment,
      paymentDate: payment.paymentDate ? String(payment.paymentDate).split("T")[0] : "", 
    },
  };
};

const handleReset = () => {
  setSelectedMember(initialMember);
};

 const handleUpdate = async (id: string, formData: Record<string, any>) => {
  if (!selectedMember) {
    throw new Error("Please select a member");
  }

  const payload = {
    directPaymentId: Number(id),
    memberId: selectedMember.memberId,
    amount: Number(formData.amount),
    paymentDate: formData.paymentDate,
    paymentDatestring: formData.paymentDate,
    paymentMode: formData.paymentMode.trim(),
    referenceNo: formData.referenceNo.trim(),
    remarks: formData.remarks?.trim() || "",
    createdByUserId: 0,
    createdDate: new Date().toISOString(),
    createdDatestring: new Date().toISOString(),
    isDeleted: false,
  } as Omit<DirectPayment, "auditLogs">;

  await DirectPaymentService.updateDirectPayment(Number(id), payload);
};

const getCurrentUserId = (): number => {
  const user = AuthService.getCurrentUser();
  if (!user?.userId) throw new Error("Unable to get current user. Please login again.");
  return user.userId;
};

// KiduEdit now owns the confirm dialog + success/error alerts + loading
// state for approval — these just do the actual service call.
const handleApprove = async (id: string) => {
  const currentUserId = getCurrentUserId();
  await DirectPaymentService.approveDirectPayment(Number(id), { approve: true, currentUserId });
  navigate("/dashboard/contributions/directpayment-list");
};

const handleReject = async (id: string) => {
  const currentUserId = getCurrentUserId();
  await DirectPaymentService.approveDirectPayment(Number(id), { approve: false, currentUserId });
  navigate("/dashboard/contributions/directpayment-list");
};

  const popupHandlers = {
    memberId: {
      value: selectedMember?.name ?? "",
      actualValue: selectedMember?.memberId,
      onOpen: () => setShowMemberPopup(true),
    },
  };
 //payment mode options
  const paymentModeOptions = [
    {value:"Cash Payment", label:"Cash Payments"},
    {value:"Bank Transfer", label:"Bank Transfer"},
    {value:"Cheque", label:"Cheque"},
    {value:"Card Payment", label:"Card Payment"},
    {value:"Digital/ Wallet Payment", label:"Digital/ Wallet Payment"},
    {value:"Recurring Payment", label:"Recurring Payment"},
    {value:"International Payment", label:"International Payment"},
    {value:"Bank Specific", label:"Bank Specific"},
    {value:"Government/ Statutory Payment", label:"Government/ Statutory Payment"},
  ]
 return (
    <>
      <KiduEdit
        title="Edit Direct Payment"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        submitButtonText="Update Direct Payment"
        showResetButton
        paramName="directPaymentId"
        navigateBackPath="/dashboard/contributions/directpayment-list"
        successMessage="Direct Payment updated successfully!"
        errorMessage="Failed to update Direct Payment"
        auditLogConfig={{ tableName: "DirectPayment", recordIdField: "directPaymentId", }}
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
        options={{ paymentMode: paymentModeOptions, }}
        onReset={handleReset}
        approvalConfig={{
          onApprove: handleApprove,
          onReject: handleReject,
          confirmApproveText: "Are you sure you want to approve this payment?",
          confirmRejectText: "Are you sure you want to reject this payment?",
          showWhen: (formData) => !formData.isApproved,
        }}
      />
      <MemberPopup
        show={showMemberPopup}
        handleClose={() => setShowMemberPopup(false)}
        onSelect={(member) => {
          setSelectedMember(member);
          setShowMemberPopup(false);
        }}/>
    </>
  );
};

export default DirectPaymentEdit;
