import KiduPopup from "../../../../Components/KiduPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { Category } from "../../../Types/Settings/Category.types";
import CategoryCreateModal from "./CategoryCreateModal";

interface CategoryPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (category: Category) => void;
}

const CategoryPopup: React.FC<CategoryPopupProps> = ({
  show,
  handleClose,
  onSelect
}) => {
  const columns = [
    { key: "categoryId" as keyof Category, label: "ID" },
    { key: "name" as keyof Category, label: "Category Name" },
    { key: "abbreviation" as keyof Category, label: "Abbreviation" }
  ];

  return (
    <KiduPopup<Category>
      show={show}
      handleClose={handleClose}
      title="Select Category"
      fetchEndpoint={API_ENDPOINTS.CATEGORY.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={CategoryCreateModal}
      idKey="categoryId"
      rowsPerPage={10}
    />
  );
};

export default CategoryPopup;