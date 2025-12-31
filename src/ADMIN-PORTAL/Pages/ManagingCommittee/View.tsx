import React from "react";
import KiduView, { type ViewField } from "../../Components/KiduView";
import ManagingCommitteeService from "../../Services/CMS/ManagingCommittee.services";

const fields: ViewField[] = [
  { key: "managingComiteeId", label: "ID" },
  { key: "managingComitteeName", label: "Name" },
  { key: "position", label: "Position" },
  { key: "description1", label: "Description 1" },
  { key: "description2", label: "Description 2" },
  { key: "imageLocation", label: "Image" },
  { key: "order", label: "Order" },
  { key: "companyId", label: "Company ID" },
];

const ManagingCommitteeView: React.FC = () => {
  return (
    <KiduView
      title="Managing Committee Details"
      fields={fields}
      onFetch={(id) => ManagingCommitteeService.getManagingCommitteeById(Number(id))}
      onDelete={(id) => ManagingCommitteeService.deleteManagingCommittee(Number(id))}
      paramName="managingComiteeId"
      editRoute="/dashboard/cms/manage-committe-edit"
      listRoute="/dashboard/cms/manage-committe-list"
      themeColor="#18575A"
    />
  );
};

export default ManagingCommitteeView;
