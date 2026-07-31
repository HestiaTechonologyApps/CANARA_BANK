import type { Field } from "../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../Components/KiduCreateModal";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";
import YearMasterService from "../../Services/Settings/YearMaster.services";

interface YearMasterCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newYear: YearMaster) => void;
}

const YearMasterCreateModal: React.FC<YearMasterCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  const fields: Field[] = [
    { name: "yearName", label: "Year", type: "number", required: true, placeholder: "e.g. 2024", minLength: 4, maxLength: 4 },
  ];

  const handleFormSubmit = async (formData: Record<string, any>): Promise<YearMaster> => {
    const year = Number(formData.yearName);

    if (isNaN(year)) {
      throw new Error("Please enter a valid year");
    }

    if (year < 1900 || year > 2100) {
      throw new Error("Year must be between 1900 and 2100");
    }

    const yearData: Omit<YearMaster, "yearOf" | "auditLogs"> = {
      yearName: year,
    };

    return YearMasterService.createYearMaster(yearData);
  };

  return (
    <KiduCreateModal<YearMaster>
      show={show}
      handleClose={handleClose}
      title="Add Year"
      icon="📅"
      accent="#1B3763"
      fields={fields}
      onSubmit={handleFormSubmit}
      onCreated={onAdded}
    />
  );
};

export default YearMasterCreateModal;