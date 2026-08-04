import KiduCreateModal from "../../../../Components/KiduCreateModal";
import type { Field } from "../../../../Components/KiduCreateModal";
import ReportTypeService from "../../../Services/Settings/ReportType.services";
import type { ReportType } from "../../../Types/Settings/ReportType.types";

interface ReportTypeCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newReportType: ReportType) => void;
}

const ReportTypeCreateModal: React.FC<ReportTypeCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  const fields: Field[] = [
    {
      name: "reportTypeName",
      label: "Report Type Name",
      type: "text",
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\-\/]+$/,
    },
    { name: "description", label: "Description", type: "textarea", required: false, maxLength: 500 },
    { name: "isActive", label: "Active", type: "toggle" },
  ];

  // Mirrors ReportTypeCreate.tsx's handleSubmit exactly, so the modal and
  // the full create page produce the same payload shape (createdDate /
  // modifiedDate stamps, trimmed strings, same regex guard on the name).
  const handleSubmit = async (formData: Record<string, any>) => {
    if (!/^[a-zA-Z\s\-\/]+$/.test(formData.reportTypeName?.trim() || "")) {
      throw new Error("Report Type Name must contain only letters, hyphens or slashes");
    }

    const payload = {
      reportTypeId: 0,
      reportTypeName: formData.reportTypeName?.trim(),
      description: formData.description?.trim(),
      createdDate: new Date().toISOString(),
      createdDateString: new Date().toLocaleString(),
      modifiedDate: new Date().toISOString(),
      modifiedDateString: new Date().toLocaleString(),
      isActive: Boolean(formData.isActive),
    };

    return await ReportTypeService.createReportType(payload);
  };

  return (
    <KiduCreateModal<ReportType>
      show={show}
      handleClose={handleClose}
      title="Add New Report Type"
      icon="📊"
      accent="#8e3b7f"
      fields={fields}
      onSubmit={handleSubmit}
      onCreated={onAdded}
    />
  );
};

export default ReportTypeCreateModal;