import React from "react";
import KiduCreate, { type Field } from "../../../Components/KiduCreate";
import ExpenseTypeService from "../../../Services/Administration/ExpenseType.services";
import type { ExpenseTypePayload } from "../../../Types/Administration/ExpenseType.types";

const ExpenseTypeCreate: React.FC = () => {
  const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "Name", required: true, maxLength: 100, colWidth: 6 }, },
    { name: "description", rules: { type: "textarea", label: "Description", required: true, maxLength: 500, colWidth: 12 }, },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: ExpenseTypePayload = {
      expenseTypeId: 0,
      name: formData.name,
      description: formData.description,
      isDeleted: false,
    };
    await ExpenseTypeService.create(payload);
  };

  return (
    <KiduCreate
      title="Add Expense Type"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create"
      successMessage="Expense type created successfully!"
      navigateOnSuccess="/dashboard/administration/expensetype-list"
      themeColor="#1B3763"
    />
  );
};

export default ExpenseTypeCreate;