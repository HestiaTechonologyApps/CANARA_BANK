import React from "react";
import KiduEdit, { type Field } from "../../../Components/KiduEdit";
import ExpenseTypeService from "../../../Services/Administration/ExpenseType.services";
import type { ExpenseType, ExpenseTypePayload } from "../../../Types/Administration/ExpenseType.types";
import type { CustomResponse } from "../../../../Types/ApiTypes";

const ExpenseTypeEdit: React.FC = () => {
  const fields: Field[] = [
    {
      name: "name",
      rules: { type: "text", label: "Name", required: true, maxLength: 100, colWidth: 6 },
    },
    {
      name: "description",
      rules: { type: "textarea", label: "Description", required: true, maxLength: 500, colWidth: 12 },
    },
  ];

 const handleFetch = async (id: string): Promise<CustomResponse<ExpenseType>> => {
    const data = await ExpenseTypeService.getById(Number(id));
    return {
      statusCode: 200,
      error: null,
      customMessage: null,
      isSucess: true,
      isSuccess: true,
      value: data,
    };
  };

  const handleUpdate = async (id: string, formData: Record<string, any>) => {
    const payload: ExpenseTypePayload = {
      expenseTypeId: Number(id),
      name: formData.name,
      description: formData.description,
      isDeleted: formData.isDeleted ?? false,
    };
    return ExpenseTypeService.update(Number(id), payload);
  };

  return (
    <KiduEdit
      title="Edit Expense Type"
      fields={fields}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      submitButtonText="Update"
      successMessage="Expense type updated successfully!"
      navigateBackPath="/dashboard/administration/expensetype-list"
      themeColor="#1B3763"
    />
  );
};

export default ExpenseTypeEdit;