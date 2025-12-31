import React, { useState } from "react";
import KiduCreate from "../../Components/KiduCreate";
import type { Field } from "../../Components/KiduCreate";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const ManagingCommitteeCreate: React.FC = () => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

 const fields: Field[] = [
  { name: "managingComitteeName", rules: { type: "text", label: "Name", required: true, placeholder: "Enter committee member name", colWidth: 6 } },
  { name: "position", rules: { type: "text", label: "Position", required: true, placeholder: "Chairman / Director / Member", colWidth: 6 } },
  { name: "description1", rules: { type: "textarea", label: "Primary Description", required: true, placeholder: "Brief introduction or role summary", colWidth: 6 } },
  { name: "description2", rules: { type: "textarea", label: "Additional Description", placeholder: "Optional additional details", colWidth: 6 } },
  { name: "imageLocation", rules: { type: "text", label: "Profile Image URL", required: true, placeholder: "https://example.com/image.jpg", colWidth: 6 } },
  { name: "order", rules: { type: "number", label: "Display Order", required: true, placeholder: "Enter display priority", colWidth: 3 } },
  { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 3 } },
];


  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedCompany) throw new Error("Please select a company");

    const payload: Omit<ManagingCommittee, "managingComiteeId" | "auditLogs"> = {
      managingComitteeName: formData.managingComitteeName.trim(),
      position: formData.position.trim(),
      description1: formData.description1.trim(),
      description2: formData.description2?.trim(),
      imageLocation: formData.imageLocation.trim(),
      order: Number(formData.order),
      companyId: selectedCompany.companyId,
    };

    await ManagingCommitteeService.createManagingCommittee(payload);
  };

  const popupHandlers = {
    companyId: {
      value: selectedCompany?.companyId?.toString() || "",
      actualValue: selectedCompany?.companyId,
      onOpen: () => setShowCompanyPopup(true),
    },
  };

  return (
    <>
      <KiduCreate
        title="Create Managing Committee"
        fields={fields}
        onSubmit={handleSubmit}
        navigateOnSuccess="/dashboard/cms/manage-committe-list"
        popupHandlers={popupHandlers}
        themeColor="#18575A"
      />

      <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={setSelectedCompany}
      />
    </>
  );
};

export default ManagingCommitteeCreate;
