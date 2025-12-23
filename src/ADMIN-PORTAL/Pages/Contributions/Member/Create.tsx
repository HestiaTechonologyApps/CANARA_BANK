import React, { useState } from "react";
import type { Field } from "../../../Components/KiduCreate";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberService from "../../../Services/Contributions/Member.services";
import KiduCreate from "../../../Components/KiduCreate";


const MemberCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    { name: "staffNo", rules: { type: "number", label: "Staff No", required: true, colWidth: 3 } },
    { name: "name", rules: { type: "text", label: "Name", required: true, minLength: 2, maxLength: 150, colWidth: 6 } },
    { name: "genderId", rules: { type: "number", label: "Gender ID", required: true, colWidth: 3 } },

    { name: "designationId", rules: { type: "number", label: "Designation ID", required: true, colWidth: 3 } },
    { name: "categoryId", rules: { type: "number", label: "Category ID", required: true, colWidth: 3 } },
    { name: "branchId", rules: { type: "number", label: "Branch ID", required: true, colWidth: 3 } },

    { name: "dob", rules: { type: "date", label: "Date of Birth", required: true, colWidth: 4 } },
    { name: "doj", rules: { type: "date", label: "Date of Joining", required: true, colWidth: 4 } },
    { name: "dojtoScheme", rules: { type: "date", label: "DOJ to Scheme", required: true, colWidth: 4 } },

    { name: "statusId", rules: { type: "number", label: "Status ID", required: true, colWidth: 3 } },
    { name: "isRegCompleted", rules: { type: "toggle", label: "Registration Completed", required: false } },

    { name: "imageId", rules: { type: "number", label: "Image ID", required: false, colWidth: 3 } },
    { name: "profileImageSrc", rules: { type: "text", label: "Profile Image Src", required: false, colWidth: 6, placeholder: "e.g., profile_rahul123.png" } },

    { name: "nominee", rules: { type: "text", label: "Nominee Name", required: false, colWidth: 4 } },
    { name: "nomineeRelation", rules: { type: "text", label: "Nominee Relation", required: false, colWidth: 4 } },
    { name: "nomineeIDentity", rules: { type: "text", label: "Nominee Identity", required: false, colWidth: 4 } },

    { name: "unionMember", rules: { type: "text", label: "Union Member (Yes/No)", required: false, colWidth: 3 } },
    { name: "totalRefund", rules: { type: "text", label: "Total Refund", required: false, colWidth: 3, placeholder: "e.g., 0" } },
  ];

  const toIsoMidnight = (val?: string) => (val ? `${val}T00:00:00` : "");

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const payload: Omit<Member, "memberId" | "auditLogs"> = {
        staffNo: Number(formData.staffNo),
        designationId: Number(formData.designationId),
        categoryId: Number(formData.categoryId),
        branchId: Number(formData.branchId),
        name: formData.name?.trim() || "",
        genderId: Number(formData.genderId),
        imageId: Number(formData.imageId || 0),

        dob: toIsoMidnight(formData.dob),
        dobString: toIsoMidnight(formData.dob),
        doj: toIsoMidnight(formData.doj),
        dojString: toIsoMidnight(formData.doj),
        dojtoScheme: toIsoMidnight(formData.dojtoScheme),
        dojtoSchemeString: toIsoMidnight(formData.dojtoScheme),

        statusId: Number(formData.statusId),
        isRegCompleted: Boolean(formData.isRegCompleted),

        createdByUserId: 0,
        createdDate: "",
        createdDateString: "",
        modifiedByUserId: 0,
        modifiedDate: "",
        modifiedDateString: "",

        nominee: formData.nominee?.trim() || "",
        profileImageSrc: formData.profileImageSrc?.trim() || "",
        nomineeRelation: formData.nomineeRelation?.trim() || "",
        nomineeIDentity: formData.nomineeIDentity?.trim() || "",
        unionMember: formData.unionMember?.trim() || "",
        totalRefund: formData.totalRefund?.toString() ?? "0",
      };

      await MemberService.createMember(payload);
    } catch (err) {
      console.error("Error creating member:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Member"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Member"
      showResetButton={true}
      loadingState={isLoading}
      successMessage="Member created successfully!"
      errorMessage="Failed to create member. Please check the details and try again."
      navigateOnSuccess="/dashboard/member/member-list"
      navigateDelay={1200}
      themeColor="#18575A"
    />
  );
};

export default MemberCreate;
