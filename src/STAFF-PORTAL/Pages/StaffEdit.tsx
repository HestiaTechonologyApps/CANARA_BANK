import React, { useState } from "react";
import type { Branch } from "../../ADMIN-PORTAL/Types/Settings/Branch.types";
import type { Designation } from "../../ADMIN-PORTAL/Types/Settings/Designation";
import type { Category } from "../../ADMIN-PORTAL/Types/Settings/Category.types";
import type { Status } from "../../ADMIN-PORTAL/Types/Settings/Status.types";
import type { Field } from "../../ADMIN-PORTAL/Components/KiduEdit";
import MemberService from "../../ADMIN-PORTAL/Services/Contributions/Member.services";
import type { Member } from "../../ADMIN-PORTAL/Types/Contributions/Member.types";
import KiduEdit from "../../ADMIN-PORTAL/Components/KiduEdit";
import BranchPopup from "../../ADMIN-PORTAL/Pages/Branch/BranchPopup";
import DesignationPopup from "../../ADMIN-PORTAL/Pages/Settings/Designation/DesignationPopup";
import CategoryPopup from "../../ADMIN-PORTAL/Pages/Settings/Category/CategoryPopup";
import StatusPopup from "../../ADMIN-PORTAL/Pages/Settings/Status/StatusPopup";

const StaffEdit: React.FC = () => {

  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const fields: Field[] = [
    { name: "staffNo", rules: { type: "number", label: "Staff No", required: true, colWidth: 3 , disabled:true } },
    { name: "name", rules: { type: "text", label: "Name", required: true, colWidth: 3 } },
     { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 3 } },
    { name: "genderId", rules: { type: "select", label: "Gender", required: true, colWidth: 3 } },

    { name: "designationId", rules: { type: "popup", label: "Designation", required: true, colWidth: 3 } },
    { name: "categoryId", rules: { type: "popup", label: "Category", required: true, colWidth: 3 } },
    { name: "branchId", rules: { type: "popup", label: "Branch", required: true, colWidth: 3 } },
    { name: "statusId", rules: { type: "popup", label: "Status", required: true, colWidth: 3 } },

   
    { name: "doj", rules: { type: "date", label: "Date of Joining", required: true, colWidth: 3 } },
    { name: "dojtoScheme", rules: { type: "date", label: "DOJ to Scheme", required: true, colWidth: 3 } },

    { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed" } },

    { name: "profileImageSrc", rules: { type: "text", label: "Profile Image", colWidth: 3 } },
    { name: "nominee", rules: { type: "text", label: "Nominee Name", colWidth: 3 } },
    { name: "nomineeRelation", rules: { type: "select", label: "Nominee Relation", colWidth: 3 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity Number", colWidth: 3 } },
    { name: "unionMember", rules: { type: "select", label: "Union Member", colWidth: 3 } },
    { name: "totalRefund", rules: { type: "text", label: "Total Refund", colWidth: 3 } },
  ];

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

  //Nominee relation options
  const nomineeRelationOptions = [
    { value: "Spouse", label: "Spouse" },
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Son", label: "Son" },
    { value: "Daughter", label: "Daughter" },
    { value: "Sibling", label: "Sibling" },
    { value: "Nephew", label: "Nephew" },
    { value: "Niece", label: "Niece" },
     { value: "Grandparent", label: "Grandparent" }
  ]

  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleFetch = async (id: string) => {
    const response = await MemberService.getMemberById(Number(id));
    const member = response.value;

     if (member) {
      setSelectedBranch({ branchId: member.branchId, name: member.branchName, dpCode: member.dpCode } as unknown as Branch);
      setSelectedDesignation({ designationId: member.designationId, name: member.designationName } as unknown as Designation);
      setSelectedCategory({ categoryId: member.categoryId, name: member.categoryname } as unknown as Category);
      setSelectedStatus({ statusId: member.statusId, name: member.status } as unknown as Status);

      // Ensure genderId is properly returned as part of the response
    // The KiduEdit component should handle this, but make sure the value exists
    return {
      ...response,
      value: {
        ...member,
        genderId: member.genderId // Explicitly ensure genderId is included
      }
    };

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
        navigateBackPath="/staff-portal"
        auditLogConfig={{ tableName: "Member", recordIdField: "memberId" }}
        popupHandlers={popupHandlers}
        themeColor="#1f4e8c"
        showBackButton={false}
        options={{
          genderId: genderOptions,
          unionMember: unionMemberOptions,
          nomineeRelation:nomineeRelationOptions
        }}
      />

      <BranchPopup 
        show={showBranchPopup} 
        handleClose={() => setShowBranchPopup(false)} 
        onSelect={setSelectedBranch} 
        showAddButton={false}
      />
      <DesignationPopup 
        show={showDesignationPopup} 
        handleClose={() => setShowDesignationPopup(false)} 
        onSelect={setSelectedDesignation} 
        showAddButton={false}
      />
      <CategoryPopup 
        show={showCategoryPopup} 
        handleClose={() => setShowCategoryPopup(false)} 
        onSelect={setSelectedCategory} 
        showAddButton={false}
      />
      <StatusPopup 
        show={showStatusPopup} 
        handleClose={() => setShowStatusPopup(false)} 
        onSelect={setSelectedStatus} 
        showAddButton={false}
      />
    </>
  );
};

export default StaffEdit