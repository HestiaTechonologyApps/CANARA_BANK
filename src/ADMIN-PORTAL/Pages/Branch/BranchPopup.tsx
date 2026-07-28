import KiduPopup from "../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { BranchLookupItem } from "../../../Types/Lookup.types";
import type { Branch } from "../../Types/Settings/Branch.types";
import BranchCreateModal from "./BranchCreateModal";

interface BranchPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (branch: Branch) => void;
  showAddButton?: boolean;
}

function mapBranchLookupItem(raw: BranchLookupItem): Branch {
  return {
    branchId: raw.branchId,
    dpCode: Number(raw.dpCode),   
    name: raw.branchName,         
    address1: "",
    district: "",
    status: "",
    isRegCompleted: false,
    circleId: 0,
  } as Branch;
}

const BranchPopup: React.FC<BranchPopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton,
}) => {
  const columns = [
    { key: "branchId" as keyof Branch, label: "ID" },
    { key: "dpCode" as keyof Branch, label: "DP Code" },
    { key: "name" as keyof Branch, label: "Branch Name" },
  ];

  return (
    <KiduPopup<Branch>
      show={show}
      handleClose={handleClose}
      title="Select Branch"
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={BranchCreateModal}
      idKey="branchId"
      showAddButton={showAddButton}
      rowsPerPage={10}
      //serverSidePagination={{
       // endpoint: API_ENDPOINTS.LOOKUP.PAGED,
       // entityName: "branch",
      //  mapItem: mapBranchLookupItem,
       // pageSize: 10,
     // }}
  //    searchKeys={["dpCode", "name"]}
  //    fetchEndpoint={API_ENDPOINTS.BRANCH.GET_ALL}
  //      filterData={(items) =>
  //   items.filter((branch) => branch.status === "Active")
  // }
  serverSidePagination={{
        endpoint: API_ENDPOINTS.LOOKUP.PAGED,
        entityName: "branch",
        mapItem: mapBranchLookupItem,
        pageSize: 10,
        extraParams: { status: "Active" }, // replaces old client-side filterData
      }}
      searchKeys={["dpCode", "name"]}
    />
  );
};

export default BranchPopup;