import KiduPopup from "../../../Components/KiduPopup";
import CircleCreateModal from "./CircleCreateModal";
import type { Circle } from "../../Types/Settings/Circle.types";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";

interface CirclePopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (circle: Circle) => void;
}

const CirclePopup: React.FC<CirclePopupProps> = ({
  show,
  handleClose,
  onSelect
}) => {
  const columns = [
    { key: "circleId" as keyof Circle, label: "ID" },
    { key: "circleCode" as keyof Circle, label: "Code" },
    { key: "name" as keyof Circle, label: "Circle Name" },
    { key: "abbreviation" as keyof Circle, label: "Abbreviation" },
    { key: "state" as keyof Circle, label: "State" },
    { key: "isActive" as keyof Circle, label: "Active" }
  ];

  return (
    <KiduPopup<Circle>
      show={show}
      handleClose={handleClose}
      title="Select Circle"
      fetchEndpoint={API_ENDPOINTS.CIRCLE.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={CircleCreateModal}
      idKey="circleId"
      rowsPerPage={10}
      searchKeys={["circleCode", "name", "abbreviation"]} // 🔥 Added searchKeys
    />
  );
};

export default CirclePopup;