import React from "react";
import type { Field } from "../../Components/KiduCreate";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";
import KiduEdit from "../../Components/KiduEdit";


const ManagingCommitteeEdit: React.FC = () => {
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

  const handleFetch = async (id: string) =>
    ManagingCommitteeService.getManagingCommitteeById(Number(id));

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const data: Omit<ManagingCommittee, "auditLogs"> = {
      managingComiteeId: Number(id),
      managingComitteeName: formData.managingComitteeName,
      position: formData.position,
      description1: formData.description1,
      description2: formData.description2,
      imageLocation: formData.imageLocation,
      order: Number(formData.order),
      companyId: Number(formData.companyId),
      companyName: formData.companyName,
    };

    await ManagingCommitteeService.updateManagingCommittee(Number(id), data);
  };

  return (
    <KiduEdit
      title="Edit Managing Committee Member"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      paramName="managingComiteeId"
      navigateBackPath="/dashboard/cms/managing-committee-list"
      auditLogConfig={{ tableName: "ManagingComitee", recordIdField: "managingComiteeId" }}
      themeColor="#18575A"
    />
  );
};

export default ManagingCommitteeEdit;
