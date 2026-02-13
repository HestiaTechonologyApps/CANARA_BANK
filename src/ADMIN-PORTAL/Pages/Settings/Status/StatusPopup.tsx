import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Status } from "../../../Types/Settings/Status.types";
import StatusCreateModal from "./StatusCreateModal";

interface StatusPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (status: Status) => void;
  showAddButton?:boolean;
}

const StatusPopup: React.FC<StatusPopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton
}) => {
  const columns = [
    { key: "statusId" as keyof Status, label: "ID" },
    { key: "name" as keyof Status, label: "Status Name" },
    { key: "abbreviation" as keyof Status, label: "Abbreviation" },
    { key: "groupId" as keyof Status, label: "Group" },
    { key: "description" as keyof Status, label: "Description" },
  ];

  return (
    <KiduPopup<Status>
      show={show}
      handleClose={handleClose}
      title="Select Status"
      fetchEndpoint={API_ENDPOINTS.STATUS.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={StatusCreateModal}
      idKey="statusId"
      rowsPerPage={10}
      searchKeys={["name", "abbreviation", "description"]} 
      showAddButton={showAddButton}
    />
  );
};

export default StatusPopup;