// src/components/Settings/Month/MonthPopup.tsx

import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Month } from "../../../Types/Settings/Month.types";
import MonthCreateModal from "./MonthCreateModal";

interface MonthPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (month: Month) => void;
}

const MonthPopup: React.FC<MonthPopupProps> = ({
  show,
  handleClose,
  onSelect
}) => {
  const columns = [
    { key: "monthCode" as keyof Month, label: "Month Code" },
    { key: "monthName" as keyof Month, label: "Month Name" },
    { key: "abbrivation" as keyof Month, label: "Abbreviation" }
  ];

  return (
    <KiduPopup<Month>
      show={show}
      handleClose={handleClose}
      title="Select Month"
      fetchEndpoint={API_ENDPOINTS.MONTH.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={MonthCreateModal}
      idKey="monthCode"
      rowsPerPage={10}
    />
  );
};

export default MonthPopup;
