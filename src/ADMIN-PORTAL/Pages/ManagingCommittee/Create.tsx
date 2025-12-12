import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";

const ManagingCommitteeCreate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    {
      name: "managingComitteeName",
      rules: {
        type: "text",
        label: "Member Name",
        required: true,
        minLength: 2,
        maxLength: 150,
        placeholder: "Enter full name",
        colWidth: 6,
      },
    },
    {
      name: "position",
      rules: {
        type: "text",
        label: "Position",
        required: true,
        minLength: 2,
        maxLength: 100,
        placeholder: "e.g., Chairman",
        colWidth: 6,
      },
    },

    {
      name: "companyId",
      rules: {
        type: "number",
        label: "Company ID",
        required: true,
        placeholder: "Enter company ID",
        colWidth: 4,
      },
    },
    {
      name: "companyName",
      rules: {
        type: "text",
        label: "Company Name",
        required: true,
        minLength: 2,
        maxLength: 150,
        placeholder: "e.g., NCanera Bank Pvt Ltd",
        colWidth: 4,
      },
    },

    {
      name: "order",
      rules: {
        type: "number",
        label: "Order",
        required: true,
        placeholder: "Display order (1,2,3...)",
        colWidth: 4,
      },
    },
    {
      name: "imageLocation",
      rules: {
        type: "text",
        label: "Image URL",
        required: false,
        placeholder: "https://example.com/image.jpg",
        colWidth: 12,
      },
    },

    {
      name: "description1",
      rules: {
        type: "textarea",
        label: "Description 1",
        required: false,
        placeholder: "Short bio or highlight 1",
        colWidth: 12,
      },
    },
    {
      name: "description2",
      rules: {
        type: "textarea",
        label: "Description 2",
        required: false,
        placeholder: "Short bio or highlight 2",
        colWidth: 12,
      },
    },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      const payload: Omit<ManagingCommittee, "managingComitteeId" | "auditLogs"> = {
        managingComitteeName: (formData.managingComitteeName || "").trim(),
        position: (formData.position || "").trim(),
        description1: (formData.description1 || "").trim(),
        description2: (formData.description2 || "").trim(),
        imageLocation: (formData.imageLocation || "").trim(),
        companyId: Number(formData.companyId),
        companyName: (formData.companyName || "").trim(),
        order: Number(formData.order),
      };

      if (!payload.managingComitteeName) throw new Error("Name is required.");
      if (!payload.position) throw new Error("Position is required.");
      if (!Number.isFinite(payload.companyId)) throw new Error("Company ID must be a number.");
      if (!Number.isFinite(payload.order) || payload.order < 1) throw new Error("Order must be a positive number.");
      if (payload.imageLocation && !/^https?:\/\/|^\/\//i.test(payload.imageLocation)) {
        // very light URL check; adjust to your needs
        throw new Error("Please provide a valid Image URL (http/https).");
      }

      await ManagingCommitteeService.createManagingCommittee(payload);
    } catch (err) {
      console.error("Error creating committee member:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KiduCreate
      title="Add Managing Committee Member"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Member"
      showResetButton
      loadingState={isLoading}
      successMessage="Member created successfully!"
      errorMessage="Failed to create member. Please check the details and try again."
      navigateOnSuccess="/dashboard/cms/manage-committe-list"
      navigateDelay={1200}
      themeColor="#18575A"
    />
  );
};

export default ManagingCommitteeCreate;
