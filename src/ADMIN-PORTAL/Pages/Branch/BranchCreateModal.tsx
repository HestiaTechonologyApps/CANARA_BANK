import type { Field } from "../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { Branch } from "../../Types/Settings/Branch.types";

interface BranchCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newBranch: Branch) => void;
}

const BranchCreateModal: React.FC<BranchCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  const fields: Field[] = [
    { name: "dpCode", label: "DP Code", type: "number", required: true },
    { name: "name", label: "Branch Name", type: "text", required: true, minLength: 2, maxLength: 100 },
    { name: "address1", label: "Address Line 1", type: "text", required: true, maxLength: 200 },
    { name: "address2", label: "Address Line 2", type: "text", required: false, maxLength: 200 },
    { name: "address3", label: "Address Line 3", type: "text", required: false, maxLength: 200 },
    { name: "district", label: "District", type: "text", required: true, maxLength: 100 }
  ];

  return (
    <KiduCreateModal<Branch>
      show={show}
      handleClose={handleClose}
      title="Add New Branch"
      fields={fields}
      endpoint={API_ENDPOINTS.BRANCH.CREATE}
      onCreated={onAdded}
    />
  );
};

export default BranchCreateModal;