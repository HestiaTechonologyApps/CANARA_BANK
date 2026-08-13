import React from "react";
import ExpenseTypeService from "../../../Services/Administration/ExpenseType.services";
import KiduServerTableList from "../../../../Components/KiduServerTableList";

const ExpenseTypeList: React.FC = () => {
  const columns = [
    { key: "expenseTypeId", label: "ID", enableSorting: true },
    { key: "name", label: "Name", enableSorting: true },
    { key: "description", label: "Description", enableSorting: false },
  ];

  return (
    <KiduServerTableList
      title="Expense Type"
      subtitle="Manage expense types used for administration expenses."
      columns={columns}
      idKey="expenseTypeId"
      fetchService={ExpenseTypeService.getAll}
      showAddButton
      addButtonLabel="Add New"
      addRoute="/dashboard/administration/expensetype-create"
      editRoute="/dashboard/administration/expensetype-edit"
      viewRoute="/dashboard/administration/expensetype-view"
    />
  );
};

export default ExpenseTypeList;