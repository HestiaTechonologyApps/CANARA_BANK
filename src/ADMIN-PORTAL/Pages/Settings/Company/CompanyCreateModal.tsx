// src/components/Company/CompanyCreateModal.tsx
import type { Field } from "../../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../../Components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Company } from "../../../Types/Settings/Company.types";

interface CompanyCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newCompany: Company) => void;
}

const CompanyCreateModal: React.FC<CompanyCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  const fields: Field[] = [
    { name: "comapanyName", label: "Company Name", type: "text", required: true, minLength: 2, maxLength: 150, },
    { name: "website", label: "Website", type: "text", required: true, },
    { name: "contactNumber", label: "Contact Number", type: "number", required: true,},
    { name: "email", label: "Email", type: "email", required: true, },
    { name: "taxNumber", label: "Tax Number", type: "text", required: true, },
    { name: "addressLine1", label: "Address Line 1", type: "text", required: true, },
    { name: "addressLine2", label: "Address Line 2", type: "text", required: false, },
    { name: "city", label: "City", type: "text", required: true,},
    { name: "state", label: "State", type: "text", required: true,},
    { name: "country", label: "Country", type: "text", required: true,},
    { name: "zipCode", label: "Zip Code", type: "text", required: true,},
    { name: "invoicePrefix", label: "Invoice Prefix", type: "text", required: true, },
    { name: "companyLogo", label: "Company Logo (Base64)", type: "text", required: false, },
 // { name: "isActive",  label: "Active",  type: "toggle", required: false, },
  ];

  return (
    <KiduCreateModal<Company>
      show={show}
      handleClose={handleClose}
      title="Add New Company"
      fields={fields}
      endpoint={API_ENDPOINTS.COMPANY.CREATE}
      onCreated={onAdded}
    />
  );
};

export default CompanyCreateModal;
