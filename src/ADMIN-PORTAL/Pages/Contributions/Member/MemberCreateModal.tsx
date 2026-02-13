import type { Field } from "../../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Member } from "../../../Types/Contributions/Member.types";

interface MemberCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newMember: Member) => void;
}

const MemberCreateModal: React.FC<MemberCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  const fields: Field[] = [
    { name: "staffNo", label: "Staff No", type: "number", required: true },
    { name: "name", label: "Name", type: "text", required: true, minLength: 2, maxLength: 150 },
    { name: "gender", label: "Gender", type: "number", required: true },
    { name: "designationName", label: "Designation", type: "number", required: true },
    { name: "categoryname", label: "Category", type: "number", required: true },
    { name: "branchName", label: "Branch ID", type: "number", required: true },
    { name: "dob", label: "Date of Birth", type: "date", required: true },
    { name: "doj", label: "Date of Joining", type: "date", required: true },
    { name: "dojtoScheme", label: "DOJ to Scheme", type: "date", required: true },
    { name: "status", label: "Status", type: "number", required: true },
  ];

  return (
    <KiduCreateModal<Member>
      show={show}
      handleClose={handleClose}
      title="Add New Member"
      fields={fields}
      endpoint={API_ENDPOINTS.MEMBER.CREATE}
      onCreated={onAdded}
    />
  );
};

export default MemberCreateModal;
