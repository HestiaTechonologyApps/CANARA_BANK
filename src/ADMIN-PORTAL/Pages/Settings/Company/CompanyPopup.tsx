import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Company } from "../../../Types/Settings/Company.types";
import CompanyCreateModal from "./CompanyCreateModal";

interface CompanyPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (company: Company) => void;
}

const CompanyPopup: React.FC<CompanyPopupProps> = ({
  show,
  handleClose,
  onSelect,
}) => {
  const columns = [
    { key: "companyId" as keyof Company, label: "ID" },
    { key: "comapanyName" as keyof Company, label: "Company Name" },
    { key: "email" as keyof Company, label: "Email" },
    { key: "contactNumber" as keyof Company, label: "Contact" },
    { key: "city" as keyof Company, label: "City" },
    { key: "state" as keyof Company, label: "State" },
    { key: "isActive" as keyof Company, label: "Active" },
  ];

  return (
    <KiduPopup<Company>
      show={show}
      handleClose={handleClose}
      title="Select Company"
      fetchEndpoint={API_ENDPOINTS.COMPANY.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={CompanyCreateModal}
      idKey="companyId"
      rowsPerPage={10}
      searchKeys={["comapanyName", "email", "contactNumber", "city", "state"]} 
    />
  );
};

export default CompanyPopup;