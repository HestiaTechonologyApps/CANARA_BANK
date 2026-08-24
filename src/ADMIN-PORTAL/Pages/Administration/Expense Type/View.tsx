import React from "react";
import KiduView, { type ViewField } from "../../../Components/KiduView";
import ExpenseTypeService from "../../../Services/Administration/ExpenseType.services";
import type { ExpenseType } from "../../../Types/Administration/ExpenseType.types";
import type { CustomResponse } from "../../../../Types/ApiTypes";

const ExpenseTypeView: React.FC = () => {
  const fields: ViewField[] = [
    { key: "expenseTypeId", label: "Expense Type ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "isDeleted", label: "Deleted", isBoolean: true },
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

  const handleDelete = async (id: string) => {
    await ExpenseTypeService.delete(Number(id));
  };

  return (
    <KiduView
      title="Expense Type Details"
      fields={fields}
      onFetch={handleFetch}
      onDelete={handleDelete}
      editRoute="/dashboard/administration/expensetype-edit"
      listRoute="/dashboard/administration/expensetype-list"
      themeColor="#1B3763"
    />
  );
};

export default ExpenseTypeView;