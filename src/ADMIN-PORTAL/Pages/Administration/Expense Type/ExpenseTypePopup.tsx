import React from "react";
import type { ExpenseType } from "../../../Types/Administration/ExpenseType.types";
import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import ExpenseTypeCreateModal from "./ExpenseTypeCreateModal";

interface ExpenseTypePopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (expenseType: ExpenseType) => void;
  showAddButton?: boolean;
}

const ExpenseTypePopup: React.FC<ExpenseTypePopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton,
}) => {
  const columns = [
    { key: "expenseTypeId" as keyof ExpenseType, label: "ID" },
    { key: "name" as keyof ExpenseType, label: "Expense Type" },
    { key: "description" as keyof ExpenseType, label: "Description" },
  ];

  const filterData = (items: ExpenseType[]) =>
    [...items].sort((a, b) => a.expenseTypeId - b.expenseTypeId);

  return (
    <KiduPopup<ExpenseType>
      show={show}
      handleClose={handleClose}
      title="Select Expense Type"
      fetchEndpoint={API_ENDPOINTS.EXPENSE_TYPE.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={ExpenseTypeCreateModal}
      idKey="expenseTypeId"
      rowsPerPage={10}
      searchKeys={["name", "description"]}
      showAddButton={showAddButton}
      filterData={filterData}
    />
  );
};

export default ExpenseTypePopup;