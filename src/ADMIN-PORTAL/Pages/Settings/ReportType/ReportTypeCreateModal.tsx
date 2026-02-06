import KiduCreateModal from "../../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Field } from "../../../../Components/KiduCreateModal";
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
    { name: "reportTypeName", label: "Report Type Name", type: "text", required: true, minLength: 2, maxLength: 100,},
    { name: "description", label: "Description", type: "textarea", required: false, maxLength: 500, },
  ];

  return (
    <KiduCreateModal<ReportType>
      show={show}
      handleClose={handleClose}
      title="Add New Report Type"
      fields={fields}
      endpoint={API_ENDPOINTS.REPORT_TYPE.CREATE}
      onCreated={onAdded}
    />
  );
};

export default ReportTypeCreateModal;
