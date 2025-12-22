// src/components/Designation/DesignationCreateModal.tsx

import KiduCreateModal from "../../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Field } from "../../../../Components/KiduCreateModal";
import type { Designation } from "../../../Types/Settings/Designation";

interface DesignationCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newDesignation: Designation) => void;
}

const DesignationCreateModal: React.FC<DesignationCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  const fields: Field[] = [
    {
      name: "name",
      label: "Designation Name",
      type: "text",
      required: true,
      minLength: 2,
      maxLength: 100
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
      maxLength: 500
    }
  ];

  return (
    <KiduCreateModal<Designation>
      show={show}
      handleClose={handleClose}
      title="Add New Designation"
      fields={fields}
      endpoint={API_ENDPOINTS.DESIGNATION.CREATE}
      onCreated={onAdded}
    />
  );
};

export default DesignationCreateModal;
