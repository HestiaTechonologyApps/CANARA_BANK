// src/components/Settings/Month/MonthCreateModal.tsx

import KiduCreateModal from "../../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Field } from "../../../../Components/KiduCreateModal";
import type { Month } from "../../../Types/Settings/Month.types";

interface MonthCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newMonth: Month) => void;
}

const MonthCreateModal: React.FC<MonthCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  const fields: Field[] = [
  { name: "monthName", label: "Month Name", type: "text", required: true, minLength: 2, maxLength: 10 },
  { name: "abbrivation", label: "Abbreviation", type: "text", required: true, minLength: 1, maxLength: 50 }
];


  return (
    <KiduCreateModal<Month>
      show={show}
      handleClose={handleClose}
      title="Add New Month"
      fields={fields}
      endpoint={API_ENDPOINTS.MONTH.CREATE}
      onCreated={onAdded}
    />
  );
};

export default MonthCreateModal;
