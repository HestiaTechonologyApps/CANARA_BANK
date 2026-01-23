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
import profiledefaultimg from "../../../Assets/Images/profile.jpg"

const MemberCreate: React.FC = () => {

  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const [_isUploading, setIsUploading] = useState(false);

  const fields: Field[] = [
    { name: "staffNo", rules: { type: "number", label: "Staff No", required: true, colWidth: 4 } },
    { name: "name", rules: { type: "text", label: "Name", required: true, minLength: 2, maxLength: 150, colWidth: 4 } },
    { name: "genderId", rules: { type: "select", label: "Gender", required: true, colWidth: 4 } },
    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 4 } },
    { name: "categoryId", rules: { type: "popup", label: "Category", required: true, colWidth: 4 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 4 } },
    { name: "statusId", rules: { type: "popup", label: "Status", required: true, colWidth: 4 } },
    { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 4 } },
    { name: "doj", rules: { type: "date", label: "Date of Joining", required: true, colWidth: 4 } },
    { name: "dojtoScheme", rules: { type: "date", label: "DOJ to Scheme", required: true, colWidth: 4 } },
    { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed" } },
    { name: "nominee", rules: { type: "text", label: "Nominee Name", colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "select", label: "Nominee Relation", colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", colWidth: 4 } },
    { name: "unionMember", rules: { type: "select", label: "Union Member", colWidth: 4 } },
    { name: "totalRefund", rules: { type: "text", label: "Total Refund", placeholder: "0", colWidth: 4 } },
  ];

  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");
  const handleSubmit = async (formData: Record<string, any>) => {
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
      totalRefund: formData.totalRefund?.toString() ?? "0",
    } as Omit<Member, "memberId" | "auditLogs">;

    const createdMember = await MemberService.createMember(payload);

  // ✅ IMAGE NOW COMES FROM KiduCreate
    if (formData.profileImage && createdMember.memberId) {
      setIsUploading(true);
      await MemberService.uploadProfilePicture(
        formData.profileImage,
        createdMember.memberId
      );
      setIsUploading(false);
    }
  };

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

  // Gender options
  const genderOptions = [
    { value: 0, label: "Male" },
    { value: 1, label: "Female" },
    { value: 2, label: "Others" }
  ];

  // Union Member options
  const unionMemberOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" }
  ];

  //nominee Relation options
  const nomineeRelationOptions = [
    {value:"Spouse", label: "Spouse"},
    {value:"Father", label: "Father"},
    {value:"Mother", label: "Mother"},
    {value:"Son", label: "Son"},
    {value:"Daughter", label: "Daughter"},
    {value:"Sibling", label: "Sibling"},
    {value:"Nephew", label: "Nephew"},
    {value:"Niece", label: "Niece"},
    {value:"Grandparent", label: "Grandparent"},
  ]

  return (
    <>
      <KiduCreate
        title="Create Member"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Member"
        showResetButton
         imageConfig={{
          fieldName: "profileImage",
          defaultImage: profiledefaultimg,
          label: "Profile Picture",
        }}
        successMessage="Member created successfully!"
        errorMessage="Failed to create member. Please try again."
        navigateOnSuccess="/dashboard/contributions/member-list"
        navigateDelay={1200}
        themeColor="#1B3763"
        popupHandlers={popupHandlers}
        options={{
          genderId: genderOptions,
          unionMember: unionMemberOptions,
          nomineeRelation: nomineeRelationOptions,
        }}
      />

      <BranchPopup 
        show={showBranchPopup} 
        handleClose={() => setShowBranchPopup(false)} 
        onSelect={setSelectedBranch} 
      />
      <DesignationPopup 
        show={showDesignationPopup} 
        handleClose={() => setShowDesignationPopup(false)} 
        onSelect={setSelectedDesignation} 
      />
      <CategoryPopup 
        show={showCategoryPopup} 
        handleClose={() => setShowCategoryPopup(false)} 
        onSelect={setSelectedCategory} 
      />
      <StatusPopup 
        show={showStatusPopup} 
        handleClose={() => setShowStatusPopup(false)} 
        onSelect={setSelectedStatus} 
      />
    </>
  );
};

export default MemberCreate;