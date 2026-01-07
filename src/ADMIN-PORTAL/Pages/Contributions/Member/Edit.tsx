import React, { useState } from "react";
import type { Field } from "../../../Components/KiduEdit";
import KiduEdit from "../../../Components/KiduEdit";
import MemberService from "../../../Services/Contributions/Member.services";
import type { Member } from "../../../Types/Contributions/Member.types";
import type { Branch } from "../../../Types/Settings/Branch.types";
import type { Designation } from "../../../Types/Settings/Designation";
import type { Category } from "../../../Types/Settings/Category.types";
import type { Status } from "../../../Types/Settings/Status.types";
import BranchPopup from "../../Branch/BranchPopup";
import DesignationPopup from "../../Settings/Designation/DesignationPopup";
import CategoryPopup from "../../Settings/Category/CategoryPopup";
import StatusPopup from "../../Settings/Status/StatusPopup";
import CategoryService from "../../../Services/Settings/Category.services";
import StatusService from "../../../Services/Settings/Status.services";
import DesignationService from "../../../Services/Settings/Designation.services";
import BranchService from "../../../Services/Settings/Branch.services";

const MemberEdit: React.FC = () => {

  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const fields: Field[] = [
    { name: "staffNo", rules: { type: "number", label: "Staff No", required: true, colWidth: 3 } },
    { name: "name", rules: { type: "text", label: "Name", required: true, colWidth: 6 } },
    { name: "genderId", rules: { type: "number", label: "Gender ID", required: true, colWidth: 3 } },

    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 3 } },
    { name: "categoryId", rules: { type: "popup", label: "Category", required: true, colWidth: 3 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 3 } },
    { name: "statusId", rules: { type: "popup", label: "Status", required: true, colWidth: 3 } },

    { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 4 } },
    { name: "doj", rules: { type: "date", label: "Date of Joining", required: true, colWidth: 4 } },
    { name: "dojtoScheme", rules: { type: "date", label: "DOJ to Scheme", required: true, colWidth: 4 } },

    { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed" } },

    { name: "profileImageSrc", rules: { type: "text", label: "Profile Image", colWidth: 3 } },
    { name: "nominee", rules: { type: "text", label: "Nominee Name", colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "text", label: "Nominee Relation", colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", colWidth: 4 } },
    { name: "unionMember", rules: { type: "text", label: "Union Member (Yes/No)", colWidth: 3 } },
    { name: "totalRefund", rules: { type: "text", label: "Total Refund", colWidth: 3 } },
  ];

  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleFetch = async (id: string) => {
  const response = await MemberService.getMemberById(Number(id));
  const member = response.value;

  if (member) {
    const branch = await BranchService.getBranchById(member.branchId);
    setSelectedBranch(branch.value);

    const designation = await DesignationService.getDesignationById(member.designationId);
    setSelectedDesignation(designation.value);

    const category = await CategoryService.getCategoryById(member.categoryId);
    setSelectedCategory(category.value);

    const status = await StatusService.getStatusById(member.statusId);
    setSelectedStatus(status.value);
  }

  return response;
};
  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedBranch || !selectedDesignation || !selectedCategory || !selectedStatus) {
      throw new Error("Please select all required values");
    }

    const payload: Omit<Member, "auditLogs"> = {
      memberId: Number(id),
      staffNo: Number(formData.staffNo),
      name: formData.name.trim(),
      genderId: Number(formData.genderId),
      designationId: selectedDesignation.designationId,
      categoryId: selectedCategory.categoryId,
      branchId: selectedBranch.branchId,
      statusId: selectedStatus.statusId,
      dob: toIsoMidnight(formData.dob),
      dobString: toIsoMidnight(formData.dob),
      doj: toIsoMidnight(formData.doj),
      dojString: toIsoMidnight(formData.doj),
      dojtoScheme: toIsoMidnight(formData.dojtoScheme),
      dojtoSchemeString: toIsoMidnight(formData.dojtoScheme),
      isRegCompleted: Boolean(formData.isRegCompleted),
      profileImageSrc: formData.profileImageSrc || "",
      nominee: formData.nominee || "",
      nomineeRelation: formData.nomineeRelation || "",
      nomineeIDentity: formData.nomineeIDentity || "",
      unionMember: formData.unionMember || "",
      totalRefund: formData.totalRefund || "0",
      createdByUserId: formData.createdByUserId,
      createdDate: formData.createdDate,
      createdDateString: formData.createdDateString,
      modifiedByUserId: formData.modifiedByUserId,
      modifiedDate: formData.modifiedDate,
      modifiedDateString: formData.modifiedDateString,
    };

    await MemberService.updateMember(Number(id), payload);
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

  return (
    <>
      <KiduEdit
        title="Edit Member"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="memberId"
        navigateBackPath="/dashboard/contributions/member-list"
        auditLogConfig={{ tableName: "Member", recordIdField: "memberId" }}
        popupHandlers={popupHandlers}
        themeColor="#1B3763"
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

export default MemberEdit;
