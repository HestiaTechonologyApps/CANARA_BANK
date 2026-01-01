import React, { useState } from "react";
import KiduEdit from "../../Components/KiduEdit";
import type { Field } from "../../Components/KiduEdit";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";
import type { Company } from "../../Types/Settings/Company.types";
import CompanyPopup from "../Settings/Company/CompanyPopup";

const ManagingCommitteeEdit: React.FC = () => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

 const fields: Field[] = [
 // { name: "managingComiteeId", rules: { type: "number", label: "ID", disabled: true, colWidth: 3 } },
  { name: "managingComitteeName", rules: { type: "text", label: "Name", required: true, placeholder: "Enter committee member name", colWidth: 6 } },
  { name: "position", rules: { type: "text", label: "Position", required: true, placeholder: "Chairman / Director / Member", colWidth: 6 } },
  { name: "description1", rules: { type: "textarea", label: "Primary Description", required: true, placeholder: "Brief introduction or role summary", colWidth: 6 } },
  { name: "description2", rules: { type: "textarea", label: "Additional Description", placeholder: "Optional additional details", colWidth: 6 } },
  { name: "imageLocation", rules: { type: "text", label: "Profile Image URL", required: true, placeholder: "https://example.com/image.jpg", colWidth: 6 } },
  { name: "order", rules: { type: "number", label: "Display Order", required: true, placeholder: "Enter display priority", colWidth: 3 } },
  { name: "companyId", rules: { type: "popup", label: "Company", required: true, colWidth: 3 } },
];


  const handleFetch = async (id: string) => {
    const response = await ManagingCommitteeService.getManagingCommitteeById(Number(id));
    if (response.value?.companyId) {
      setSelectedCompany({ companyId: response.value.companyId } as Company);
    }
    return response;
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    if (!selectedCompany) throw new Error("Please select a company");

    const payload: Omit<ManagingCommittee, "auditLogs"> = {
      managingComiteeId: Number(id),
      managingComitteeName: formData.managingComitteeName,
      position: formData.position,
      description1: formData.description1,
      description2: formData.description2,
      imageLocation: formData.imageLocation,
      order: Number(formData.order),
      companyId: selectedCompany.companyId,
    };

    await ManagingCommitteeService.updateManagingCommittee(Number(id), payload);
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
      <KiduEdit
        title="Edit Managing Committee"
        fields={fields}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        paramName="managingComiteeId"
        navigateBackPath="/dashboard/cms/manage-committe-list"
        auditLogConfig={{ tableName: "Managing committees", recordIdField: "managingComiteeId" }}
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

export default ManagingCommitteeEdit;
