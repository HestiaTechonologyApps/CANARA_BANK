import React, { useState } from "react";
import type { Field } from "../../Components/KiduCreate";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import KiduCreate from "../../Components/KiduCreate";

const ManagingCommitteeCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    { name: "managingComitteeName", rules: { type: "text", label: "Name", required: true, colWidth: 6 } },
    { name: "position", rules: { type: "text", label: "Position", required: true, colWidth: 6 } },
    { name: "description1", rules: { type: "textarea", label: "Description 1", required: true } },
    { name: "description2", rules: { type: "textarea", label: "Description 2" } },
    { name: "imageLocation", rules: { type: "text", label: "Image URL", required: true } },
    { name: "order", rules: { type: "number", label: "Display Order", required: true, colWidth: 4 } },
    { name: "companyId", rules: { type: "number", label: "Company ID", required: true, colWidth: 4 } },
    { name: "companyName", rules: { type: "text", label: "Company Name", required: true, colWidth: 4 } },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const data: Omit<ManagingCommittee, "managingComiteeId" | "auditLogs"> = {
        managingComitteeName: formData.managingComitteeName.trim(),
        position: formData.position.trim(),
        description1: formData.description1.trim(),
        description2: formData.description2?.trim(),
        imageLocation: formData.imageLocation.trim(),
        order: Number(formData.order),
        companyId: Number(formData.companyId),
        companyName: formData.companyName.trim(),
      };

      await ManagingCommitteeService.createManagingCommittee(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Create Managing Committee Member"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create"
      loadingState={isLoading}
      successMessage="Managing committee member created successfully!"
      errorMessage="Failed to create managing committee member"
      navigateOnSuccess="/dashboard/cms/managing-committee-list"
      themeColor="#18575A"
    />
  );
};

export default ManagingCommitteeCreate;
