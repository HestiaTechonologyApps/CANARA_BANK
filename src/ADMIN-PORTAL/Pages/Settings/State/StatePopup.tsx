import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { State } from "../../../Types/Settings/States.types";
import StateCreateModal from "./StateCreateModal";

interface StatePopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (state: State) => void;
   showAddButton?:boolean;
}

const StatePopup: React.FC<StatePopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton
}) => {
  const columns = [
    { key: "stateId" as keyof State, label: "ID" },
    { key: "name" as keyof State, label: "State Name" },
    { key: "abbreviation" as keyof State, label: "Abbreviation" },
   // { key: "isActive" as keyof State, label: "Active" }
   { key: "isActive" as keyof State, label: "Active", type: "checkbox" as const },
  ];

  return (
    <KiduPopup<State>
      show={show}
      handleClose={handleClose}
      title="Select State"
      fetchEndpoint={API_ENDPOINTS.STATE.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={StateCreateModal}
      idKey="stateId"
      rowsPerPage={10}
      showAddButton={showAddButton}
    />
  );
};

export default StatePopup;