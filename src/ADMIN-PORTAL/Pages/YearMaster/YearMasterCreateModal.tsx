import type { Field } from "../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";

interface YearMasterCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newYear: YearMaster) => void;
}

const YearMasterCreateModal: React.FC<YearMasterCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  
  const fields: Field[] = [
    { name: "yearName", label: "Year", type: "select", required: true, },
  ];

  return (
    <KiduCreateModal<YearMaster>
      show={show}
      handleClose={handleClose}
      title="Add Year"
      fields={fields}
      endpoint={API_ENDPOINTS.YEAR_MASTER.CREATE}
      onCreated={onAdded}
    />
  );
};

export default YearMasterCreateModal;
