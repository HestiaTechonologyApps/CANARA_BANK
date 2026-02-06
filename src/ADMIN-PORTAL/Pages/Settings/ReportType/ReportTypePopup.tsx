import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { ReportType } from "../../../Types/Settings/ReportType.types";
import ReportTypeCreateModal from "./ReportTypeCreateModal";

interface ReportTypePopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (reportType: ReportType) => void;
  showAddButton?: boolean;
}

const ReportTypePopup: React.FC<ReportTypePopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton,
}) => {
  const columns = [
    { key: "reportTypeId" as keyof ReportType, label: "ID" },
    { key: "reportTypeName" as keyof ReportType, label: "Report Type" },
    { key: "description" as keyof ReportType, label: "Description" },
  ];

  return (
    <KiduPopup<ReportType>
      show={show}
      handleClose={handleClose}
      title="Select Report Type"
      fetchEndpoint={API_ENDPOINTS.REPORT_TYPE.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={ReportTypeCreateModal}
      idKey="reportTypeId"
      rowsPerPage={10}
      searchKeys={["reportTypeName", "description"]}
      showAddButton={showAddButton}
    />
  );
};

export default ReportTypePopup;
