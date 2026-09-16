import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Member } from "../../Types/Contributions/Member.types";
import type { State } from "../../Types/Settings/States.types";
import type { Designation } from "../../Types/Settings/Designation.types";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import type { Field } from "../../Components/KiduEdit";
import RefundContributionService from "../../Services/Claims/Refund.services";
import MemberService from "../../Services/Contributions/Member.services";
import StateService from "../../Services/Settings/State.services";
import DesignationService from "../../Services/Settings/Designation.services";
import YearMasterService from "../../Services/Settings/YearMaster.services";
import AuthService from "../../../Services/Auth.services";
import KiduEdit from "../../Components/KiduEdit";

const THEME_COLOR = "#1B3763";

const RefundContributionApprovalEdit: React.FC = () => {
    const navigate = useNavigate();

    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [selectedState, setSelectedState] = useState<State | null>(null);
    const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
    const [selectedYearMaster, setSelectedYearMaster] = useState<YearMaster | null>(null);

    const fields: Field[] = [
        { name: "stateId", rules: { type: "popup", label: "State", required: true, colWidth: 4, disabled: true } },
        { name: "memberId", rules: { type: "popup", label: "Member", required: true, colWidth: 4, disabled: true } },
        { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4, disabled: true } },
        { name: "refundNO", rules: { type: "text", label: "Refund No", required: true, colWidth: 4, disabled: true } },
        { name: "branchNameOFTime", rules: { type: "text", label: "Branch Name (At the Time)", required: true, colWidth: 4, disabled: true } },
        { name: "dpcodeOfTime", rules: { type: "text", label: "DP Code (At the Time)", required: true, colWidth: 4, disabled: true } },
        { name: "type", rules: { type: "text", label: "Type", required: true, colWidth: 4, disabled: true } },
        { name: "ddno", rules: { type: "text", label: "DD No", required: true, colWidth: 4, disabled: true } },
        { name: "dddate", rules: { type: "date", label: "DD Date", required: true, colWidth: 4, disabled: true } },
        { name: "amount", rules: { type: "number", label: "Amount", required: true, colWidth: 4, disabled: true } },
        { name: "lastContribution", rules: { type: "number", label: "Last Contribution", colWidth: 4, disabled: true } },
        { name: "yearOF", rules: { type: "popup", label: "Year", required: true, colWidth: 4, disabled: true } },
        { name: "remark", rules: { type: "textarea", label: "Remark", colWidth: 4, disabled: true } },
    ];

    const handleFetch = async (id: string) => {
        const response = await RefundContributionService.getRefundContributionById(Number(id));
        const refund = response.value;
        if (!refund) return response;

        if (refund.stateId) {
            const state = (await StateService.getStateById(refund.stateId)).value;
            setSelectedState(state);
        }
        if (refund.memberId) {
            const member = (await MemberService.getMemberById(refund.memberId)).value;
            setSelectedMember(member);
        }
        if (refund.designationId) {
            const designation = (await DesignationService.getDesignationById(refund.designationId)).value;
            setSelectedDesignation(designation);
        }
        if (refund.yearOF) {
            const year = (await YearMasterService.getYearMasterById(refund.yearOF)).value;
            setSelectedYearMaster(year);
        }

        return {
            ...response,
            value: {
                ...refund,
                dddate: refund.dddate ? String(refund.dddate).split("T")[0] : "",
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
        await RefundContributionService.approveRefundContribution(Number(id), { approve: true, currentUserId });
        navigate("/dashboard/approval-list?tab=refund");
    };

    const handleReject = async (id: string) => {
        const currentUserId = getCurrentUserId();
        await RefundContributionService.approveRefundContribution(Number(id), { approve: false, currentUserId });
        navigate("/dashboard/approval-list?tab=refund");
    };

    const popupHandlers = {
        stateId: { value: selectedState?.name || "", actualValue: selectedState?.stateId, onOpen: () => { } },
        memberId: { value: selectedMember?.name || "", actualValue: selectedMember?.memberId, onOpen: () => { } },
        designationId: { value: selectedDesignation?.name || "", actualValue: selectedDesignation?.designationId, onOpen: () => { } },
        yearOF: { value: selectedYearMaster ? String(selectedYearMaster.yearName) : "", actualValue: selectedYearMaster?.yearOf, onOpen: () => { } },
    };

    return (
        <KiduEdit
            title="Review Refund Contribution"
            fields={fields}
            onFetch={handleFetch}
            onUpdate={handleUpdate}
            showResetButton={false}
            paramName="refundContributionId"
            navigateBackPath="/dashboard/approval-list?tab=refund"
            auditLogConfig={{ tableName: "RefundContribution", recordIdField: "refundContributionId" }}
            popupHandlers={popupHandlers}
            themeColor={THEME_COLOR}
            approvalConfig={{
                onApprove: handleApprove,
                onReject: handleReject,
                confirmApproveText: "Are you sure you want to approve this refund contribution?",
                confirmRejectText: "Are you sure you want to reject this refund contribution?",
                showWhen: (formData) => !formData.isApproved,
            }}
        />
    );
};

export default RefundContributionApprovalEdit;