import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberCreateModal from "./MemberCreateModal";

interface MemberPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (member: Member) => void;
  showAddButton?: boolean
}

const MemberPopup: React.FC<MemberPopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton
}) => {
  const columns = [
    { key: "memberId" as keyof Member, label: "ID" },
    { key: "staffNo" as keyof Member, label: "Staff No" },
    { key: "name" as keyof Member, label: "Name" },
    { key: "designationName" as keyof Member, label: "Designation" },
    { key: "branchName" as keyof Member, label: "Branch" },
    { key: "isRegCompleted" as keyof Member, label: "Reg.Completed" },
  ];

  return (
    <KiduPopup<Member>
      show={show}
      handleClose={handleClose}
      title="Select Member"
      fetchEndpoint={API_ENDPOINTS.MEMBER.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={MemberCreateModal}
      idKey="memberId"
      rowsPerPage={10}
      showAddButton={showAddButton}
    />
  );
};

export default MemberPopup;
