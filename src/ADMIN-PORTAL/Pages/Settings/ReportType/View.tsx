import React from "react";
import type { ViewField } from "../../../Components/KiduView";
import ReportTypeService from "../../../Services/Settings/ReportType.services";
import KiduView from "../../../Components/KiduView";

const ReportTypeView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "reportTypeId", label: "Report Type ID", icon: "bi-hash" },
    { key: "reportTypeName", label: "Report Type Name", icon: "bi-file-text" },
    { key: "description", label: "Description", icon: "bi-card-text" },
    { key: "createdDateString", label: "Created Date", icon: "bi-clock" },
    { key: "modifiedDateString", label: "Modified Date", icon: "bi-clock-history" },
    { key: "isActive", label: "Active", icon: "bi-check-circle", isBoolean: true },
  ];

const handleFetch = async (id: string) => {
  const res = await ReportTypeService.getReportTypeById(Number(id));
  const data = res.value;

  if (!data) return res;

  return {
    ...res,
    value: {
      ...data,
      createdDateString: data.createdDate
        ? new Date(data.createdDate).toLocaleDateString("en-IN")
        : "",
      modifiedDateString: data.modifiedDate
        ? new Date(data.modifiedDate).toLocaleDateString("en-IN")
        : "",
    },
  };
};

  const handleDelete = async (id: string) => {
    await ReportTypeService.deleteReportType(Number(id));
  };

  return (
    <KiduView
      title="Report Type Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/settings/reportType-edit"
      listRoute="/dashboard/settings/reportType-list"
      paramName="reportTypeId"
      auditLogConfig={{ tableName: "ReportType", recordIdField: "reportTypeId",}}
      themeColor="#1B3763"
      showEditButton
      showDeleteButton
      deleteConfirmMessage="Are you sure you want to delete this report type? This action cannot be undone."
    />
  );
};

export default ReportTypeView;
