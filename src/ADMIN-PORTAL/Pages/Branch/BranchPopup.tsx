import KiduPopup from "../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchCreateModal from "./BranchCreateModal";

interface BranchPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (branch: Branch) => void;
}

const BranchPopup: React.FC<BranchPopupProps> = ({
  show,
  handleClose,
  onSelect
}) => {
  const columns = [
    { key: "branchId" as keyof Branch, label: "ID" },
    { key: "dpCode" as keyof Branch, label: "DP Code" },
    { key: "name" as keyof Branch, label: "Branch Name" },
    { key: "district" as keyof Branch, label: "District" },
    { key: "status" as keyof Branch, label: "Status" }
  ];

  return (
    <KiduPopup<Branch>
      show={show}
      handleClose={handleClose}
      title="Select Branch"
      fetchEndpoint={API_ENDPOINTS.BRANCH.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={BranchCreateModal}
      idKey="branchId"
      rowsPerPage={10}
    />
  );
};

export default BranchPopup;