import React from "react";
import type { ExpenseType } from "../../../Types/Administration/ExpenseType.types";
import type { ExpenseTypeLookupItem } from "../../../../Types/Lookup.types";
import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import ExpenseTypeCreateModal from "./ExpenseTypeCreateModal";


interface ExpenseTypePopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (expenseType: ExpenseType) => void;
  showAddButton?: boolean;
}

function mapExpenseTypeLookupItem(raw: ExpenseTypeLookupItem): ExpenseType {
  return {
    expenseTypeId: raw.expenseTypeId,
    name: raw.expenseTypeName,
    description: "",
    isDeleted: false,
  } as ExpenseType;
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
  ];

  return (
    <KiduPopup<ExpenseType>
      show={show}
      handleClose={handleClose}
      title="Select Expense Type"
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={ExpenseTypeCreateModal}
      idKey="expenseTypeId"
      showAddButton={showAddButton}
      rowsPerPage={10}
      serverSidePagination={{
        endpoint: API_ENDPOINTS.LOOKUP.PAGED,
        entityName: "expensetype",
        mapItem: mapExpenseTypeLookupItem,
        pageSize: 10,
      }}
      searchKeys={["name"]}
    />
  );
};

export default ExpenseTypePopup;