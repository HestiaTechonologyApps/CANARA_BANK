import type { Field } from "../../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { State } from "../../../Types/Settings/States.types";

interface StateCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newState: State) => void;
}

const StateCreateModal: React.FC<StateCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  const fields: Field[] = [
    { name: "name", label: "State Name", type: "text", required: true, minLength: 2, maxLength: 100 },
    { name: "abbreviation", label: "Abbreviation", type: "text", required: true, minLength: 2, maxLength: 10}
  ];

  return (
    <KiduCreateModal<State>
      show={show}
      handleClose={handleClose}
      title="Add New State"
      fields={fields}
      endpoint={API_ENDPOINTS.STATE.CREATE}
      onCreated={onAdded}
    />
  );
};

export default StateCreateModal;