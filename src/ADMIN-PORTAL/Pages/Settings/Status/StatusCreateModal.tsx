import type { Field } from "../../../../Components/KiduCreateModal";
import KiduCreateModal from "../../../../Components/KiduCreateModal";
import type { Status } from "../../../Types/Settings/Status.types";
import StatusService from "../../../Services/Settings/Status.services";

interface StatusCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newStatus: Status) => void;
}

const groupIdOptions = [
  { value: 1, label: "Group 1" },
  { value: 2, label: "Group 2" },
  { value: 3, label: "Group 3" },
  { value: 4, label: "Group 4" },
  { value: 5, label: "Group 5" },
  { value: 6, label: "Group 6" },
  { value: 7, label: "Group 7" },
  { value: 8, label: "Group 8" },
  { value: 9, label: "Group 9" },
  { value: 10, label: "Group 10" },
];

const StatusCreateModal: React.FC<StatusCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  const fields: Field[] = [
    { name: "name", label: "Status Name", type: "text", required: true, minLength: 2, maxLength: 100, placeholder: "Enter status name" },
    { name: "abbreviation", label: "Abbreviation", type: "text", required: true, minLength: 1, maxLength: 100, placeholder: "Enter abbreviation (e.g., ACT, PEN)" },
    { name: "groupId", label: "Group ID", type: "select", required: true, options: groupIdOptions, placeholder: "Select group" },
    { name: "description", label: "Description", type: "textarea", required: false, maxLength: 500, placeholder: "Enter status description", colSpan: true },
  ];

  const handleFormSubmit = async (formData: Record<string, any>): Promise<Status> => {
    const statusData: Omit<Status, "statusId" | "auditLogs"> = {
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim().toUpperCase(),
      description: formData.description?.trim() || "",
      groupId: Number(formData.groupId),
    };

    return StatusService.createStatus(statusData);
  };

  return (
    <KiduCreateModal<Status>
      show={show}
      handleClose={handleClose}
      title="Add New Status"
      icon="🏷️"
      accent="#1B3763"
      fields={fields}
      onSubmit={handleFormSubmit}
      onCreated={onAdded}
    />
  );
};

export default StatusCreateModal;