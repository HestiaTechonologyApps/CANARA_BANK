import type { Field } from "../../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Status } from "../../../Types/Settings/Status.types";

interface StatusCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newStatus: Status) => void;
}

const StatusCreateModal: React.FC<StatusCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  const fields: Field[] = [
    { name: "name", label: "Status Name", type: "text", required: true, minLength: 2, maxLength: 100, },
    { name: "abbreviation", label: "Abbreviation", type: "text", required: true, minLength: 1, maxLength: 10,},
    { name: "groupId", label: "Group", type: "number", required: true, },
    { name: "description", label: "Description", type: "textarea", required: false, maxLength: 500, },
  ];

  return (
    <KiduCreateModal<Status>
      show={show}
      handleClose={handleClose}
      title="Add New Status"
      fields={fields}
      endpoint={API_ENDPOINTS.STATUS.CREATE}
      onCreated={onAdded}
    />
  );
};

export default StatusCreateModal;
