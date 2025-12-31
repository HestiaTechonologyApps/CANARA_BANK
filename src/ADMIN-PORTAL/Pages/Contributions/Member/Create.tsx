import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Category } from "../../../Types/Settings/Category.types";
import type { Status } from "../../../Types/Settings/Status.types";
import type { Designation } from "../../../Types/Settings/Designation";
import MemberService from "../../../Services/Contributions/Member.services";
import KiduCreate from "../../../Components/KiduCreate";
import BranchPopup from "../../Branch/BranchPopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import CategoryPopup from "../../Settings/Category/CategoryPopup";
import StatusPopup from "../../Settings/Status/StatusPopup";

const MemberCreate: React.FC = () => {
  // ───────────────────── Popup States ─────────────────────
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  // ───────────────────── Selected Values ─────────────────────
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  // ───────────────────── Fields ─────────────────────
  const fields: Field[] = [
    { name: "staffNo", rules: { type: "number", label: "Staff No", required: true, colWidth: 3 } },
    { name: "name", rules: { type: "text", label: "Name", required: true, minLength: 2, maxLength: 150, colWidth: 6 } },
    { name: "genderId", rules: { type: "number", label: "Gender ID", required: true, colWidth: 3 } },

    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "categoryId", rules: { type: "popup", label: "Category", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },

    { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 4 } },
    { name: "doj", rules: { type: "date", label: "Date of Joining", required: true, colWidth: 4 } },
    { name: "dojtoScheme", rules: { type: "date", label: "DOJ to Scheme", required: true, colWidth: 4 } },

    { name: "statusId", rules: { type: "popup", label: "Status", required: true, colWidth: 3 } },
    { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed" } },

    { name: "profileImageSrc", rules: { type: "text", label: "Profile Image", placeholder: "profile_image.png", colWidth: 3 } },

    { name: "nominee", rules: { type: "text", label: "Nominee Name", colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "text", label: "Nominee Relation", colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", colWidth: 4 } },

    { name: "unionMember", rules: { type: "text", label: "Union Member (Yes / No)", colWidth: 3 } },
    { name: "totalRefund", rules: { type: "text", label: "Total Refund", placeholder: "0", colWidth: 3 } },
  ];

  // ───────────────────── Helpers ─────────────────────
  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");

  // ───────────────────── Submit ─────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedBranch) throw new Error("Please select a branch");
    if (!selectedDesignation) throw new Error("Please select a designation");
    if (!selectedCategory) throw new Error("Please select a category");
    if (!selectedStatus) throw new Error("Please select a status");

    const payload: Omit<Member, "memberId" | "auditLogs"> = {
      staffNo: Number(formData.staffNo),
      name: formData.name.trim(),
      genderId: Number(formData.genderId),

      designationId: selectedDesignation.designationId,
      categoryId: selectedCategory.categoryId,
      branchId: selectedBranch.branchId,

      dob: toIsoMidnight(formData.dob),
      dobString: toIsoMidnight(formData.dob),
      doj: toIsoMidnight(formData.doj),
      dojString: toIsoMidnight(formData.doj),
      dojtoScheme: toIsoMidnight(formData.dojtoScheme),
      dojtoSchemeString: toIsoMidnight(formData.dojtoScheme),

      statusId: selectedStatus.statusId,
      isRegCompleted: Boolean(formData.isRegCompleted),

      nominee: formData.nominee?.trim() || "",
      nomineeRelation: formData.nomineeRelation?.trim() || "",
      nomineeIDentity: formData.nomineeIDentity?.trim() || "",
      profileImageSrc: formData.profileImageSrc?.trim() || "",
      unionMember: formData.unionMember?.trim() || "",
      totalRefund: formData.totalRefund?.toString() ?? "0",
    };

    await MemberService.createMember(payload);
  };

  // ───────────────────── Popup Handlers (CRITICAL) ─────────────────────
  const popupHandlers = {
    branchId: {
      value: selectedBranch ? `${selectedBranch.dpCode} - ${selectedBranch.name}` : "",
      actualValue: selectedBranch?.branchId,
      onOpen: () => setShowBranchPopup(true),
    },
    designationId: {
      value: selectedDesignation?.name || "",
      actualValue: selectedDesignation?.designationId,
      onOpen: () => setShowDesignationPopup(true),
    },
    categoryId: {
      value: selectedCategory?.name || "",
      actualValue: selectedCategory?.categoryId,
      onOpen: () => setShowCategoryPopup(true),
    },
    statusId: {
      value: selectedStatus?.name || "",
      actualValue: selectedStatus?.statusId,
      onOpen: () => setShowStatusPopup(true),
    },
  };

  return (
    <>
      <KiduCreate
        title="Create Member"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Member"
        showResetButton
        successMessage="Member created successfully!"
        errorMessage="Failed to create member. Please try again."
        navigateOnSuccess="/dashboard/contributions/member-list"
        navigateDelay={1200}
        themeColor="#18575A"
        popupHandlers={popupHandlers}
      />

      <BranchPopup show={showBranchPopup} handleClose={() => setShowBranchPopup(false)} onSelect={setSelectedBranch} />
      <DesignationPopup show={showDesignationPopup} handleClose={() => setShowDesignationPopup(false)} onSelect={setSelectedDesignation} />
      <CategoryPopup show={showCategoryPopup} handleClose={() => setShowCategoryPopup(false)} onSelect={setSelectedCategory} />
      <StatusPopup show={showStatusPopup} handleClose={() => setShowStatusPopup(false)} onSelect={setSelectedStatus} />
    </>
  );
};

export default MemberCreate;
