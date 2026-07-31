import React, { useState } from "react";
import type { Field } from "../../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../../Components/KiduCreateModal";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Category } from "../../../Types/Settings/Category.types";
import type { Status } from "../../../Types/Settings/Status.types";
import type { Designation } from "../../../Types/Settings/Designation.types";
import MemberService from "../../../Services/Contributions/Member.services";
import BranchPopup from "../../Branch/BranchPopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import CategoryPopup from "../../Settings/Category/CategoryPopup";
import StatusPopup from "../../Settings/Status/StatusPopup";

interface MemberCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newMember: Member) => void;
}

const genderOptions = [
  { value: 0, label: "Male" },
  { value: 1, label: "Female" },
  { value: 2, label: "Others" },
];
const unionMemberOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];
const nomineeRelationOptions = [
  { value: "Spouse", label: "Spouse" },
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
  { value: "Sibling", label: "Sibling" },
  { value: "Nephew", label: "Nephew" },
  { value: "Niece", label: "Niece" },
  { value: "Grandparent", label: "Grandparent" },
];

const MemberCreateModal: React.FC<MemberCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [nomineeValue, setNomineeValue] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleReset = () => {
    setSelectedBranch(null);
    setSelectedDesignation(null);
    setSelectedCategory(null);
    setSelectedStatus(null);
    setNomineeValue("");
  };

  const fields: Field[] = [
    { name: "staffNo", label: "Staff No", type: "number", required: true },
    { name: "name", label: "Name", type: "text", required: true, minLength: 2, maxLength: 150, pattern: /^[a-zA-Z\s]+$/ },
    { name: "genderId", label: "Gender", type: "select", required: true, options: genderOptions, placeholder: "Select gender" },
    { name: "designationId", label: "Designation", type: "popup", required: true, placeholder: "Select designation" },
    { name: "categoryId", label: "Category", type: "popup", required: true, placeholder: "Select category" },
    { name: "branchId", label: "Branch", type: "popup", required: true, placeholder: "Select branch" },
    { name: "statusId", label: "Status", type: "popup", required: true, placeholder: "Select status" },
    { name: "dob", label: "Date of Birth", type: "date", required: true, max: today },
    { name: "doj", label: "Date of Joining", type: "date", required: true, max: today },
    { name: "dojtoScheme", label: "DOJ to Scheme", type: "date", required: true },
    { name: "nominee", label: "Nominee Name", type: "text", pattern: /^[a-zA-Z\s]+$/ },
    { name: "nomineeRelation", label: "Nominee Relation", type: "select", options: nomineeRelationOptions, placeholder: "Select relation", disabled: !nomineeValue.trim() },
    { name: "nomineeIDentity", label: "Nominee Identity", type: "text", placeholder: "Aadhar / PAN etc.", disabled: !nomineeValue.trim() },
    { name: "unionMember", label: "Union Member", type: "select", options: unionMemberOptions, placeholder: "Select" },
    { name: "isRegCompleted", label: "Registration Completed", type: "toggle", colSpan: true },
  ];

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

  const handleFormSubmit = async (formData: Record<string, any>): Promise<Member> => {
    if (!selectedBranch) throw new Error("Please select a branch");
    if (!selectedDesignation) throw new Error("Please select a designation");
    if (!selectedCategory) throw new Error("Please select a category");
    if (!selectedStatus) throw new Error("Please select a status");

    const payload = {
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
      profileImageSrc: "",
      unionMember: formData.unionMember?.trim() || "",
      totalRefund: "0",
    } as Omit<Member, "memberId" | "auditLogs">;

    return MemberService.createMember(payload);
  };

  return (
    <>
      <KiduCreateModal<Member>
        show={show}
        handleClose={handleClose}
        title="Add New Member"
        icon="👤"
        accent="#0d7377"
        fields={fields}
        popupHandlers={popupHandlers}
        onSubmit={handleFormSubmit}
        onCreated={onAdded}
        onReset={handleReset}
        fieldChangeHandlers={{
          nominee: (value) => setNomineeValue(value),
        }}
      />
      <BranchPopup show={showBranchPopup} handleClose={() => setShowBranchPopup(false)} onSelect={b => { setSelectedBranch(b); setShowBranchPopup(false); }} />
      <DesignationPopup show={showDesignationPopup} handleClose={() => setShowDesignationPopup(false)} onSelect={d => { setSelectedDesignation(d); setShowDesignationPopup(false); }} />
      <CategoryPopup show={showCategoryPopup} handleClose={() => setShowCategoryPopup(false)} onSelect={c => { setSelectedCategory(c); setShowCategoryPopup(false); }} />
      <StatusPopup show={showStatusPopup} handleClose={() => setShowStatusPopup(false)} onSelect={s => { setSelectedStatus(s); setShowStatusPopup(false); }} />
    </>
  );
};

export default MemberCreateModal;