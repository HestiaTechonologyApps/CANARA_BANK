import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";
import profiledefaultimg from "../../Assets/Images/profile.jpg";

const ManagingCommitteeCreate: React.FC = () => {

  const [_isUploading, setIsUploading] = useState(false);

  // ================= FORM FIELDS =================
  const fields: Field[] = [
    { name: "managingComitteeName", rules: { type: "text", label: "Name", required: true, placeholder: "Enter committee member name", colWidth: 6 } },
    { name: "position", rules: { type: "text", label: "Position", required: true, placeholder: "Chairman / Director / Member", colWidth: 6 } },
    { name: "description1", rules: { type: "textarea", label: "Primary Description", required: true, placeholder: "Brief introduction or role summary", colWidth: 6 } },
    { name: "description2", rules: { type: "textarea", label: "Additional Description", placeholder: "Optional additional details", colWidth: 6 } },
    { name: "order", rules: { type: "number", label: "Display Order", required: true, placeholder: "Enter display priority", colWidth: 6 } },
  ];

  // ================= SUBMIT HANDLER =================
  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Omit<ManagingCommittee, "managingComiteeId" | "auditLogs"> = {
      managingComitteeName: formData.managingComitteeName.trim(),
      position: formData.position.trim(),
      description1: formData.description1.trim(),
      description2: formData.description2?.trim(),
      imageLocation: "",
      order: Number(formData.order),
      companyId: formData.companyId,
      profileImageSrc: ""
    };

    const createdCommittee = await ManagingCommitteeService.createManagingCommittee(payload);

    if (formData.profileImage && createdCommittee.managingComiteeId) {
      try {
        setIsUploading(true);
        await ManagingCommitteeService.uploadManagingCommitteeImage(
          formData.profileImage,
          createdCommittee.managingComiteeId
        );
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <KiduCreate
        title="Create Managing Committee"
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Managing Committee"
        showResetButton
        imageConfig={{
          fieldName: "profileImage",
          defaultImage: profiledefaultimg,
          label: "Committee Member Image",
        }}
        successMessage="Managing Committee created successfully!"
        errorMessage="Failed to create managing committee. Please try again."
        navigateOnSuccess="/dashboard/cms/manage-committe-list"
        themeColor="#1B3763"
      />
    </>
  );
};

export default ManagingCommitteeCreate;
