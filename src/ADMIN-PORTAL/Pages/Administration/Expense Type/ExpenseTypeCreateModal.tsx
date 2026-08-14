import React from "react";
import type { ExpenseType, ExpenseTypePayload } from "../../../Types/Administration/ExpenseType.types";
import type { Field } from "../../../../Components/KiduCreateModal";
import ExpenseTypeService from "../../../Services/Administration/ExpenseType.services";
import KiduCreateModal from "../../../../Components/KiduCreateModal";


interface ExpenseTypeCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newExpenseType: ExpenseType) => void;
}

const ExpenseTypeCreateModal: React.FC<ExpenseTypeCreateModalProps> = ({
  show,
  handleClose,
  onAdded,
}) => {
  const fields: Field[] = [
    { name: "name", label: "Expense Type Name", type: "text", required: true, colSpan: true },
    { name: "description", label: "Description", type: "textarea", colSpan: true },
  ];

  const handleFormSubmit = async (formData: Record<string, any>): Promise<ExpenseType> => {
    const payload: ExpenseTypePayload = {
      expenseTypeId: 0,
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      isDeleted: false,
    };

    return ExpenseTypeService.create(payload);
  };

  return (
    <KiduCreateModal<ExpenseType>
      show={show}
      handleClose={handleClose}
      title="Add New Expense Type"
      icon="💰"
      accent="#1B3763"
      fields={fields}
      onSubmit={handleFormSubmit}
      onCreated={onAdded}
    />
  );
};

export default ExpenseTypeCreateModal;