import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { MemberLookupItem } from "../../../../Types/Lookup.types";
import type { Member } from "../../../Types/Contributions/Member.types";
import MemberCreateModal from "./MemberCreateModal";

interface MemberPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (member: Member) => void;
  showAddButton?: boolean;
  branchId?: number;   // NEW — optional, filters member lookup by branch (lookupMasterId)
}

function mapMemberLookupItem(raw: MemberLookupItem): Member {
  return {
    memberId: raw.memberId,
    staffNo: raw.staffNo,
    name: raw.memberName,        // Member.name, not memberName
    branchName: raw.branchName,
    // Fields below aren't returned by the lookup — default them so the
    // Member shape is satisfied. Only memberId/name/staffNo/branchName
    // are actually used by the popup selection flow.
    designationId: 0,
    categoryId: 0,
    branchId: 0,
    genderId: 0,
    dob: "",
    doj: "",
    dojtoScheme: "",
    statusId: 0,
    isRegCompleted: false,
    createdByUserId: 0,
    createdDate: "",
    createdDateString: "",
    modifiedByUserId: 0,
    modifiedDate: "",
    modifiedDateString: "",
    nominee: "",
    nomineeRelation: "",
    nomineeIDentity: "",
    unionMember: "",
    totalRefund: "",
  } as Member;
}

const MemberPopup: React.FC<MemberPopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton,
  branchId,
}) => {
  const columns = [
    { key: "memberId" as keyof Member, label: "ID" },
    { key: "staffNo" as keyof Member, label: "Staff No" },
    { key: "name" as keyof Member, label: "Name" },
    { key: "branchName" as keyof Member, label: "Branch" },
  ];

  return (
    <KiduPopup<Member>
      show={show}
      handleClose={handleClose}
      title="Select Member"
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={MemberCreateModal}
      idKey="memberId"
      rowsPerPage={10}
      showAddButton={showAddButton}
      serverSidePagination={{
        endpoint: API_ENDPOINTS.LOOKUP.PAGED,
        entityName: "member",
        lookupMasterId: branchId ?? 0,
        mapItem: mapMemberLookupItem,
        pageSize: 10,
      }}
    />
  );
};

export default MemberPopup;