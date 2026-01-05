import type { Field } from "../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { Circle } from "../../Types/Settings/Circle.types";

interface CircleCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newCircle: Circle) => void;
}

const CircleCreateModal: React.FC<CircleCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  const fields: Field[] = [
    { name: "circleCode", label: "Circle Code", type: "number", required: true },
    { name: "name", label: "Circle Name", type: "text", required: true, minLength: 2, maxLength: 100 },
    { name: "abbreviation", label: "Abbreviation", type: "text", required: true, minLength: 2, maxLength: 10 },
    { name: "stateId", label: "State ID", type: "number", required: true },
    { name: "dateFrom", label: "Date From", type: "date", required: true },
    { name: "dateTo", label: "Date To", type: "date", required: true }
  ];

  return (
    <KiduCreateModal<Circle>
      show={show}
      handleClose={handleClose}
      title="Add New Circle"
      fields={fields}
      endpoint={API_ENDPOINTS.CIRCLE.CREATE}
      onCreated={onAdded}
    />
  );
};

export default CircleCreateModal;