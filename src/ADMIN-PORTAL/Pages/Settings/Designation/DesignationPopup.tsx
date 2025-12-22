// src/components/Designation/DesignationPopup.tsx
import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Designation } from "../../../Types/Settings/Designation";
import DesignationCreateModal from "./DesignationCreateModal";


interface DesignationPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (designation: Designation) => void;
}

const DesignationPopup: React.FC<DesignationPopupProps> = ({
  show,
  handleClose,
  onSelect
}) => {
  const columns = [
    { key: "designationId" as keyof Designation, label: "ID" },
    { key: "name" as keyof Designation, label: "Designation Name" },
    { key: "description" as keyof Designation, label: "Description" }
  ];

  return (
    <KiduPopup<Designation>
      show={show}
      handleClose={handleClose}
      title="Select Designation"
      fetchEndpoint={API_ENDPOINTS.DESIGNATION.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={DesignationCreateModal}
      idKey="designationId"
      rowsPerPage={10}
    />
  );
};

export default DesignationPopup;
