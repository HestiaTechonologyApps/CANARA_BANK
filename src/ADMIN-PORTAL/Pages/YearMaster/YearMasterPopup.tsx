// src/components/YearMaster/YearMasterPopup.tsx
import KiduPopup from "../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import YearMasterCreateModal from "./YearMasterCreateModal";

interface YearMasterPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (year: YearMaster) => void;
  showAddButton?: boolean;
}

const YearMasterPopup: React.FC<YearMasterPopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton = true,
}) => {
  const columns = [
    { key: "yearOf" as keyof YearMaster, label: "Year Of" },
    { key: "yearName" as keyof YearMaster, label: "Year" },
  ];

  return (
    <KiduPopup<YearMaster>
      show={show}
      handleClose={handleClose}
      title="Select Year"
      fetchEndpoint={API_ENDPOINTS.YEAR_MASTER.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={YearMasterCreateModal}
      idKey="yearOf"
      rowsPerPage={10}
      searchKeys={["yearName", "yearOf"]}
      showAddButton={showAddButton}
    />
  );
};

export default YearMasterPopup;
